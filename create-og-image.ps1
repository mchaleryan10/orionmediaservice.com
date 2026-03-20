Add-Type -AssemblyName System.Drawing

$width = 1200
$height = 630
$outputPath = Join-Path $PSScriptRoot "images\og-image.jpg"
$heroPath = Join-Path $PSScriptRoot "images\heroes\homepage-hero.jpg"
$logoPath = Join-Path $PSScriptRoot "images\orion-logo.png"

# Create canvas
$bmp = New-Object System.Drawing.Bitmap($width, $height)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

# --- BACKGROUND: Load and crop-fit hero image ---
$hero = [System.Drawing.Image]::FromFile($heroPath)
$heroAspect = $hero.Width / $hero.Height
$targetAspect = $width / $height

if ($heroAspect -gt $targetAspect) {
    # Hero is wider - crop sides
    $srcH = $hero.Height
    $srcW = [int]($hero.Height * $targetAspect)
    $srcX = [int](($hero.Width - $srcW) / 2)
    $srcY = 0
} else {
    # Hero is taller - crop top/bottom
    $srcW = $hero.Width
    $srcH = [int]($hero.Width / $targetAspect)
    $srcX = 0
    $srcY = [int](($hero.Height - $srcH) / 2)
}

$srcRect = New-Object System.Drawing.Rectangle($srcX, $srcY, $srcW, $srcH)
$destRect = New-Object System.Drawing.Rectangle(0, 0, $width, $height)
$g.DrawImage($hero, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)

# --- OVERLAY: Dark gradient for text readability ---
# Top-down gradient: subtle at top, heavier at bottom
$overlayBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Point(0, 0)),
    (New-Object System.Drawing.Point(0, $height)),
    [System.Drawing.Color]::FromArgb(120, 12, 14, 26),
    [System.Drawing.Color]::FromArgb(220, 12, 14, 26)
)
$g.FillRectangle($overlayBrush, 0, 0, $width, $height)

# Additional center radial darkening for text area
$centerBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(80, 12, 14, 26))
$g.FillRectangle($centerBrush, 0, [int]($height * 0.25), $width, [int]($height * 0.55))

# --- LOGO: Place centered ---
$logo = [System.Drawing.Image]::FromFile($logoPath)
$logoSize = 90
$logoX = [int](($width - $logoSize) / 2)
$logoY = 155
$logoRect = New-Object System.Drawing.Rectangle($logoX, $logoY, $logoSize, $logoSize)
$g.DrawImage($logo, $logoRect)

# --- TYPOGRAPHY ---
# "ORION MEDIA" in warm gold, large serif
$goldColor = [System.Drawing.Color]::FromArgb(232, 201, 122)  # #e8c97a
$whiteColor = [System.Drawing.Color]::FromArgb(232, 232, 240)  # #e8e8f0
$accentColor = [System.Drawing.Color]::FromArgb(123, 111, 204) # #7b6fcc

# Try to use a serif font
$titleFont = $null
$taglineFont = $null
$dividerFont = $null

# Try Playfair Display first, then Georgia, then Times New Roman
$serifFonts = @("Playfair Display", "Georgia", "Times New Roman", "Palatino Linotype")
foreach ($fontName in $serifFonts) {
    try {
        $testFont = New-Object System.Drawing.Font($fontName, 10)
        if ($testFont.Name -eq $fontName -or $testFont.Name -like "*$fontName*") {
            $titleFont = New-Object System.Drawing.Font($fontName, 42, [System.Drawing.FontStyle]::Bold)
            break
        }
        $testFont.Dispose()
    } catch {}
}
if ($null -eq $titleFont) {
    $titleFont = New-Object System.Drawing.Font("Georgia", 42, [System.Drawing.FontStyle]::Bold)
}

# Sans-serif for tagline
$sansFonts = @("Outfit", "Segoe UI", "Calibri", "Arial")
foreach ($fontName in $sansFonts) {
    try {
        $testFont = New-Object System.Drawing.Font($fontName, 10)
        if ($testFont.Name -eq $fontName -or $testFont.Name -like "*$fontName*") {
            $taglineFont = New-Object System.Drawing.Font($fontName, 16, [System.Drawing.FontStyle]::Regular)
            break
        }
        $testFont.Dispose()
    } catch {}
}
if ($null -eq $taglineFont) {
    $taglineFont = New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Regular)
}

# String format for centering
$sf = New-Object System.Drawing.StringFormat
$sf.Alignment = [System.Drawing.StringAlignment]::Center
$sf.LineAlignment = [System.Drawing.StringAlignment]::Center

# Draw "ORION MEDIA" title
$titleBrush = New-Object System.Drawing.SolidBrush($goldColor)
$titleText = "ORION MEDIA"
$titleY = 265
$titleRect = New-Object System.Drawing.RectangleF(0, $titleY, $width, 60)
$g.DrawString($titleText, $titleFont, $titleBrush, $titleRect, $sf)

# Draw thin accent line
$linePen = New-Object System.Drawing.Pen($accentColor, 1.5)
$lineY = 340
$lineHalfW = 60
$g.DrawLine($linePen, [int]($width/2 - $lineHalfW), $lineY, [int]($width/2 + $lineHalfW), $lineY)

# Draw tagline
$taglineBrush = New-Object System.Drawing.SolidBrush($whiteColor)
$taglineText = "Videography & Photography  |  Capital Region NY"
$taglineY = 358
$taglineRect = New-Object System.Drawing.RectangleF(0, $taglineY, $width, 35)
$g.DrawString($taglineText, $taglineFont, $taglineBrush, $taglineRect, $sf)

# --- SAVE ---
$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 95L)
$bmp.Save($outputPath, $jpegCodec, $encoderParams)

# Cleanup
$g.Dispose()
$bmp.Dispose()
$hero.Dispose()
$logo.Dispose()
$titleFont.Dispose()
$taglineFont.Dispose()
$titleBrush.Dispose()
$taglineBrush.Dispose()
$overlayBrush.Dispose()
$centerBrush.Dispose()
$linePen.Dispose()

Write-Host "OG image created at: $outputPath"
Write-Host "Dimensions: ${width}x${height}"
