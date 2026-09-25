/**
 * Orion Media — Instant Estimate & Package Builder Logic
 * Zero external dependencies, vanilla JavaScript with light/dark theme support.
 */

(function () {
    // Current State
    var currentService = 'realestate';
    var sqft = 2400;

    var state = {
        realestate: {
            pkg: 'mediapro',
            pkgName: 'Media Pro',
            pkgPrice: 450,
            choice: 'video',
            addons: { twilightReal: false, twilightAi: false, floorplan: false, rush: false, staging: false }
        },
        weddings: {
            pkg: 'cinematic',
            pkgName: 'Cinematic',
            pkgPrice: 4000,
            addons: { second: false, raw: false, teaser: false, rehearsal: false, booth: false }
        },
        corporate: {
            pkg: 'recap',
            pkgName: 'Event Recap',
            pkgPrice: 1000,
            addons: { drone: false, extended: false, social: false, rush: false }
        },
        drone: {
            pkg: 'bundle',
            pkgName: 'Full Aerial Bundle',
            pkgPrice: 275,
            addons: { raw: false, twilight: false }
        }
    };

    var currentDisplayPrice = 450;
    var animFrameId = null;

    // Service Switcher
    window.calcSwitchService = function (service) {
        currentService = service;
        var tabs = document.querySelectorAll('.calc-tab-btn');
        tabs.forEach(function (btn) {
            btn.classList.remove('active');
            if (btn.getAttribute('data-service') === service) {
                btn.classList.add('active');
            }
        });

        var panels = document.querySelectorAll('.calc-tab-panel');
        panels.forEach(function (panel) {
            panel.classList.remove('active');
        });

        var targetPanel = document.getElementById('calc-panel-' + service);
        if (targetPanel) {
            targetPanel.classList.add('active');
        }

        calcRecalculate();
    };

    // Square Footage Slider
    window.calcUpdateSqFt = function (val) {
        sqft = parseInt(val, 10) || 2400;
        var display = document.getElementById('calc-sqft-display');
        if (display) {
            display.textContent = Number(sqft).toLocaleString();
        }
        calcRecalculate();
    };

    // Package Selectors
    window.calcSelectREPackage = function (pkg, basePrice, name) {
        state.realestate.pkg = pkg;
        state.realestate.pkgPrice = basePrice;
        state.realestate.pkgName = name || (pkg.charAt(0).toUpperCase() + pkg.slice(1));

        var cards = document.querySelectorAll('#calc-panel-realestate .calc-pkg-card');
        cards.forEach(function (c) { c.classList.remove('selected'); });
        var target = document.getElementById('re-pkg-' + pkg);
        if (target) target.classList.add('selected');

        var choiceBox = document.getElementById('calc-mediapro-choice-container');
        if (choiceBox) {
            choiceBox.style.display = (pkg === 'mediapro') ? 'flex' : 'none';
        }

        calcRecalculate();
    };

    window.calcSelectWeddingPackage = function (pkg, price, name) {
        state.weddings.pkg = pkg;
        state.weddings.pkgPrice = price;
        state.weddings.pkgName = name || (pkg.charAt(0).toUpperCase() + pkg.slice(1));

        var cards = document.querySelectorAll('#calc-panel-weddings .calc-pkg-card');
        cards.forEach(function (c) { c.classList.remove('selected'); });
        var target = document.getElementById('wed-pkg-' + pkg);
        if (target) target.classList.add('selected');

        calcRecalculate();
    };

    window.calcSelectCorporatePackage = function (pkg, price, name) {
        state.corporate.pkg = pkg;
        state.corporate.pkgPrice = price;
        state.corporate.pkgName = name || (pkg.charAt(0).toUpperCase() + pkg.slice(1));

        var cards = document.querySelectorAll('#calc-panel-corporate .calc-pkg-card');
        cards.forEach(function (c) { c.classList.remove('selected'); });
        var target = document.getElementById('corp-pkg-' + pkg);
        if (target) target.classList.add('selected');

        calcRecalculate();
    };

    window.calcSelectDronePackage = function (pkg, price, name) {
        state.drone.pkg = pkg;
        state.drone.pkgPrice = price;
        state.drone.pkgName = name || (pkg.charAt(0).toUpperCase() + pkg.slice(1));

        var cards = document.querySelectorAll('#calc-panel-drone .calc-pkg-card');
        cards.forEach(function (c) { c.classList.remove('selected'); });
        var target = document.getElementById('drone-pkg-' + pkg);
        if (target) target.classList.add('selected');

        calcRecalculate();
    };

    // Addon Toggler
    window.calcToggleAddon = function (checkbox, labelId) {
        var lbl = document.getElementById(labelId);
        if (lbl) {
            if (checkbox.checked) {
                lbl.classList.add('selected');
            } else {
                lbl.classList.remove('selected');
            }
        }
        calcRecalculate();
    };

    // Helper to calculate Corporate Rush Delivery price based on package
    function getCorporateRushPrice() {
        if (state.corporate.pkg === 'halfday') return 450;
        if (state.corporate.pkg === 'fullday') return 800;
        return 200; // recap and promo
    }

    // Real Estate Twilight Options (Mutually Exclusive Toggle)
    window.calcToggleTwilight = function (type) {
        var realCb = document.getElementById('re-addon-twilight-real');
        var realLbl = document.getElementById('re-addon-twilight-real-lbl');
        var aiCb = document.getElementById('re-addon-twilight-ai');
        var aiLbl = document.getElementById('re-addon-twilight-ai-lbl');

        if (type === 'real') {
            if (realCb && realCb.checked) {
                if (aiCb) aiCb.checked = false;
                if (aiLbl) aiLbl.classList.remove('selected');
                if (realLbl) realLbl.classList.add('selected');
            } else {
                if (realLbl) realLbl.classList.remove('selected');
            }
        } else if (type === 'ai') {
            if (aiCb && aiCb.checked) {
                if (realCb) realCb.checked = false;
                if (realLbl) realLbl.classList.remove('selected');
                if (aiLbl) aiLbl.classList.add('selected');
            } else {
                if (aiLbl) aiLbl.classList.remove('selected');
            }
        }
        if (state.realestate && state.realestate.addons) {
            state.realestate.addons.twilightReal = realCb ? realCb.checked : false;
            state.realestate.addons.twilightAi = aiCb ? aiCb.checked : false;
        }
        calcRecalculate();
    };

    // Smooth Number Animation with Guaranteed Timer Completion
    function animateValue(start, end, duration) {
        var el = document.getElementById('calc-display-total');
        if (!el) return;

        var currentText = el.textContent.replace(/,/g, '');
        var parsed = parseInt(currentText, 10);
        var actualStart = !isNaN(parsed) ? parsed : start;

        currentDisplayPrice = end;
        if (actualStart === end) {
            el.textContent = Number(end).toLocaleString();
            return;
        }

        if (animFrameId) {
            clearInterval(animFrameId);
            animFrameId = null;
        }

        var startTime = Date.now();
        var dur = duration || 150;

        animFrameId = setInterval(function () {
            var elapsed = Date.now() - startTime;
            var progress = Math.min(elapsed / dur, 1);
            var ease = 1 - Math.pow(1 - progress, 2);
            var current = Math.round(actualStart + (end - actualStart) * ease);
            el.textContent = Number(current).toLocaleString();
            if (progress >= 1) {
                clearInterval(animFrameId);
                animFrameId = null;
                el.textContent = Number(end).toLocaleString();
            }
        }, 16);
    }

    // Master Recalculate
    window.calcRecalculate = function () {
        var total = 0;
        var savings = 0;

        if (currentService === 'realestate') {
            var base = state.realestate.pkgPrice;
            var choiceRadio = document.querySelector('input[name="mediapro-choice"]:checked');
            var isMatterport = (state.realestate.pkg === 'mediapro' && choiceRadio && choiceRadio.value === 'matterport') || (state.realestate.pkg === 'elite');

            // Square footage surcharge over 2,500 sq ft:
            // Standard photos/video: +$25 per 500 sq ft
            // Packages with Matterport 3D scanning (Media Pro w/ Matterport or Elite): +$50 per 500 sq ft ($25 photos + $25 Matterport scan time)
            if (sqft > 2500) {
                var extraBlocks = Math.ceil((sqft - 2500) / 500);
                var ratePerBlock = isMatterport ? 50 : 25;
                base += extraBlocks * ratePerBlock;
            }
            total = base;

            var twReal = document.getElementById('re-addon-twilight-real');
            if (twReal && twReal.checked) total += 150;
            var twAi = document.getElementById('re-addon-twilight-ai');
            if (twAi && twAi.checked) total += 50;
            var fl = document.getElementById('re-addon-floorplan');
            if (fl && fl.checked) total += 50;
            var ru = document.getElementById('re-addon-rush');
            if (ru && ru.checked) total += 75;
            var st = document.getElementById('re-addon-staging');
            if (st && st.checked) total += 70;

            if (state.realestate.pkg === 'mediapro') savings = 25;
            if (state.realestate.pkg === 'elite') savings = 50;

        } else if (currentService === 'weddings') {
            total = state.weddings.pkgPrice;
            var sec = document.getElementById('wed-addon-second');
            if (sec && sec.checked) total += 600;
            var raw = document.getElementById('wed-addon-raw');
            if (raw && raw.checked) total += 350;
            var tea = document.getElementById('wed-addon-teaser');
            if (tea && tea.checked) total += 300;
            var reh = document.getElementById('wed-addon-rehearsal');
            if (reh && reh.checked) total += 500;
            var bth = document.getElementById('wed-addon-booth');
            if (bth && bth.checked) total += 350;

        } else if (currentService === 'corporate') {
            total = state.corporate.pkgPrice;
            var dro = document.getElementById('corp-addon-drone');
            if (dro && dro.checked) total += 150;
            var ext = document.getElementById('corp-addon-extended');
            if (ext && ext.checked) total += 300;
            var soc = document.getElementById('corp-addon-social');
            if (soc && soc.checked) total += 150;
            var cru = document.getElementById('corp-addon-rush');
            var rushFee = getCorporateRushPrice();
            if (cru && cru.checked) total += rushFee;

            var rushPriceSpan = document.getElementById('corp-addon-rush-price');
            if (rushPriceSpan) {
                rushPriceSpan.textContent = '+$' + rushFee;
            }

        } else if (currentService === 'drone') {
            total = state.drone.pkgPrice;
            var draw = document.getElementById('drone-addon-raw');
            if (draw && draw.checked) total += 75;
            var dtw = document.getElementById('drone-addon-twilight');
            if (dtw && dtw.checked) total += 100;

            if (state.drone.pkg === 'bundle') savings = 75;
        }

        animateValue(currentDisplayPrice, total, 150);

        var badge = document.getElementById('calc-savings-badge');
        if (badge) {
            if (savings > 0) {
                badge.style.display = 'inline-flex';
                badge.textContent = '✨ Bundle Savings: Saves $' + savings;
            } else {
                badge.style.display = 'none';
            }
        }
    };

    // Build Formatted Scope String & Payload
    function generateScopePayload() {
        var totalEl = document.getElementById('calc-display-total');
        var total = totalEl ? totalEl.textContent : '450';
        var summary = {
            serviceKey: currentService,
            serviceName: '',
            packageName: '',
            packageKey: '',
            sqft: sqft,
            addons: [],
            total: total,
            mediaChoice: '',
            textMessage: ''
        };

        if (currentService === 'realestate') {
            summary.serviceName = 'Real Estate Photography & Media';
            summary.packageKey = state.realestate.pkg;
            summary.packageName = state.realestate.pkgName;

            var choiceRadio = document.querySelector('input[name="mediapro-choice"]:checked');
            var choiceLabel = (choiceRadio && choiceRadio.value === 'matterport') ? '3D Matterport Tour' : 'Cinematic Video Walkthrough';
            if (state.realestate.pkg === 'mediapro') {
                summary.mediaChoice = choiceLabel;
            }

            if (document.getElementById('re-addon-twilight-real') && document.getElementById('re-addon-twilight-real').checked) summary.addons.push('Real Twilight (+$150)');
            if (document.getElementById('re-addon-twilight-ai') && document.getElementById('re-addon-twilight-ai').checked) summary.addons.push('AI Virtual Twilight (+$50)');
            if (document.getElementById('re-addon-floorplan') && document.getElementById('re-addon-floorplan').checked) summary.addons.push('2D Floor Plan (+$50)');
            if (document.getElementById('re-addon-rush') && document.getElementById('re-addon-rush').checked) summary.addons.push('Express 9 AM Delivery (+$75)');
            if (document.getElementById('re-addon-staging') && document.getElementById('re-addon-staging').checked) summary.addons.push('Virtual Staging (+$70)');

        } else if (currentService === 'weddings') {
            summary.serviceName = 'Wedding Videography';
            summary.packageKey = state.weddings.pkg;
            summary.packageName = state.weddings.pkgName;

            if (document.getElementById('wed-addon-second') && document.getElementById('wed-addon-second').checked) summary.addons.push('2nd Videographer (+$600)');
            if (document.getElementById('wed-addon-raw') && document.getElementById('wed-addon-raw').checked) summary.addons.push('Raw Footage Drive (+$350)');
            if (document.getElementById('wed-addon-teaser') && document.getElementById('wed-addon-teaser').checked) summary.addons.push('48-Hr Teaser Reel (+$300)');
            if (document.getElementById('wed-addon-rehearsal') && document.getElementById('wed-addon-rehearsal').checked) summary.addons.push('Rehearsal Dinner (+$500)');
            if (document.getElementById('wed-addon-booth') && document.getElementById('wed-addon-booth').checked) summary.addons.push('Drunk Advice Booth (+$350)');

        } else if (currentService === 'corporate') {
            summary.serviceName = 'Corporate & Commercial Video';
            summary.packageKey = state.corporate.pkg;
            summary.packageName = state.corporate.pkgName;

            var corpRushPrice = getCorporateRushPrice();
            if (document.getElementById('corp-addon-drone') && document.getElementById('corp-addon-drone').checked) summary.addons.push('Drone Aerials (+$150)');
            if (document.getElementById('corp-addon-extended') && document.getElementById('corp-addon-extended').checked) summary.addons.push('Extended 3-5m Cut (+$300)');
            if (document.getElementById('corp-addon-social') && document.getElementById('corp-addon-social').checked) summary.addons.push('Vertical 9:16 Cuts (+$150)');
            if (document.getElementById('corp-addon-rush') && document.getElementById('corp-addon-rush').checked) summary.addons.push('5-Day Rush Delivery (+$' + corpRushPrice + ')');

        } else if (currentService === 'drone') {
            summary.serviceName = 'Drone Aerial Flight';
            summary.packageKey = state.drone.pkg;
            summary.packageName = state.drone.pkgName;

            if (document.getElementById('drone-addon-raw') && document.getElementById('drone-addon-raw').checked) summary.addons.push('Raw D-Log Files (+$75)');
            if (document.getElementById('drone-addon-twilight') && document.getElementById('drone-addon-twilight').checked) summary.addons.push('Twilight Sunset Flight (+$100)');
        }

        var lines = [];
        lines.push('=== ONLINE ESTIMATE DETAILS ===');
        lines.push('Service: ' + summary.serviceName);
        lines.push('Package: ' + summary.packageName);
        if (summary.sqft && currentService === 'realestate') {
            var choiceRadio = document.querySelector('input[name="mediapro-choice"]:checked');
            var isMatterport = (state.realestate.pkg === 'mediapro' && choiceRadio && choiceRadio.value === 'matterport') || (state.realestate.pkg === 'elite');
            var sqftLine = 'Property Size: ' + Number(summary.sqft).toLocaleString() + ' sq ft';
            if (summary.sqft > 2500) {
                var extraBlocks = Math.ceil((summary.sqft - 2500) / 500);
                var rate = isMatterport ? 50 : 25;
                sqftLine += ' (+$' + (extraBlocks * rate) + (isMatterport ? ' includes Matterport 3D scan scaling' : ' standard size scale') + ')';
            }
            lines.push(sqftLine);
        }
        if (summary.mediaChoice) {
            lines.push('Included Choice: ' + summary.mediaChoice);
        }
        if (summary.addons.length > 0) {
            lines.push('Add-Ons: ' + summary.addons.join(', '));
        }
        lines.push('Calculated Estimate: $' + summary.total);
        lines.push('===============================');
        lines.push('');
        lines.push('Hi Ryan, I calculated this package online and would like to check your availability for my upcoming project!');

        summary.textMessage = lines.join('\n');
        return summary;
    }

    // Form Autofill & Scroll Action
    window.calcApplyEstimate = function () {
        var payload = generateScopePayload();

        // 1. If on index.html with #homepageForm
        var homeForm = document.getElementById('homepageForm');
        var homeService = homeForm ? homeForm.querySelector('select[name="service"]') : null;
        var homeMessage = homeForm ? homeForm.querySelector('textarea[name="message"]') : null;

        // 2. If on contact.html with #inquiryForm
        var inqForm = document.getElementById('inquiryForm');
        var inqService = inqForm ? inqForm.querySelector('select[name="service"]') : null;
        var inqMessage = inqForm ? inqForm.querySelector('textarea[name="message"]') : null;
        var inqBudget = inqForm ? inqForm.querySelector('select[name="budget"]') : null;

        var targetForm = homeForm || inqForm;

        if (homeForm && homeService && homeMessage) {
            // Map service to select option
            if (payload.serviceKey === 'realestate') {
                homeService.value = 'real-estate';
            } else if (payload.serviceKey === 'weddings') {
                homeService.value = 'wedding-video';
            } else if (payload.serviceKey === 'corporate') {
                homeService.value = 'commercial';
            } else if (payload.serviceKey === 'drone') {
                homeService.value = 'drone';
            }

            homeMessage.value = payload.textMessage;

            // Show banner if present
            var banner = document.getElementById('calc-applied-banner');
            if (banner) {
                var titleEl = banner.querySelector('.calc-applied-title span');
                var descEl = banner.querySelector('.calc-applied-desc');
                if (titleEl) titleEl.textContent = 'Package Applied: ' + payload.packageName + ' ($' + payload.total + ')';
                if (descEl) descEl.textContent = 'Your estimated package details and scope have been added to the message field below. Feel free to add any additional notes or submit directly!';
                banner.classList.add('active');
            }

            // Scroll down to contact
            var contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            // Trigger visual pulse
            var formWrap = homeForm.closest('.contact-form');
            if (formWrap) {
                formWrap.classList.remove('calc-form-highlight');
                void formWrap.offsetWidth; // force reflow
                formWrap.classList.add('calc-form-highlight');
            }

            return;
        }

        if (inqForm && inqService && inqMessage) {
            // Map to contact.html options
            if (payload.serviceKey === 'realestate') {
                if (payload.packageKey === 'essential') inqService.value = 're-essential';
                else if (payload.packageKey === 'aerial') inqService.value = 're-aerial';
                else if (payload.packageKey === 'mediapro') inqService.value = 're-media';
                else if (payload.packageKey === 'elite') inqService.value = 're-elite';
                else inqService.value = 're-media';
            } else if (payload.serviceKey === 'weddings') {
                inqService.value = 'wedding-video';
            } else if (payload.serviceKey === 'corporate') {
                inqService.value = 'commercial-video';
            } else if (payload.serviceKey === 'drone') {
                inqService.value = 'drone-custom';
            }

            var numTotal = parseInt(payload.total.replace(/,/g, ''), 10) || 0;
            if (inqBudget) {
                if (numTotal < 300) inqBudget.value = 'under-300';
                else if (numTotal <= 600) inqBudget.value = '300-600';
                else if (numTotal <= 1000) inqBudget.value = '600-1000';
                else if (numTotal <= 2500) inqBudget.value = '1000-2500';
                else inqBudget.value = '2500+';
            }

            inqMessage.value = payload.textMessage;

            var inqBanner = document.getElementById('calc-applied-banner');
            if (inqBanner) {
                var inqTitle = inqBanner.querySelector('.calc-applied-title span');
                var inqDesc = inqBanner.querySelector('.calc-applied-desc');
                if (inqTitle) inqTitle.textContent = 'Estimate Attached: ' + payload.packageName + ' ($' + payload.total + ')';
                if (inqDesc) inqDesc.textContent = 'Your calculated estimate has been filled into the form below. Add any details or hit Send Inquiry!';
                inqBanner.classList.add('active');
            }

            inqForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        // 3. If neither form is present on this page, redirect to contact.html with query parameters
        var query = new URLSearchParams({
            service: payload.serviceKey,
            pkg: payload.packageKey,
            name: payload.packageName,
            sqft: payload.sqft,
            total: payload.total,
            addons: payload.addons.join(';')
        });
        window.location.href = 'contact.html?' + query.toString() + '#inquiryForm';
    };

    // Check URL parameters on page load (for contact.html and estimate.html)
    function checkUrlParameters() {
        var params = new URLSearchParams(window.location.search);
        var sKey = params.get('service');
        if (sKey && ['realestate', 'weddings', 'corporate', 'drone'].indexOf(sKey) !== -1) {
            calcSwitchService(sKey);
        }

        if (!params.has('total') && !params.has('pkg')) return;

        var sKey = params.get('service');
        var pKey = params.get('pkg');
        var pName = params.get('name') || 'Selected Package';
        var total = params.get('total') || '';
        var sqftParam = params.get('sqft') || '';
        var addonsParam = params.get('addons') || '';

        var inqForm = document.getElementById('inquiryForm');
        if (!inqForm) return;

        var inqService = inqForm.querySelector('select[name="service"]');
        var inqMessage = inqForm.querySelector('textarea[name="message"]');
        var inqBudget = inqForm.querySelector('select[name="budget"]');

        if (inqService) {
            if (sKey === 'realestate') {
                if (pKey === 'essential') inqService.value = 're-essential';
                else if (pKey === 'aerial') inqService.value = 're-aerial';
                else if (pKey === 'mediapro') inqService.value = 're-media';
                else if (pKey === 'elite') inqService.value = 're-elite';
                else inqService.value = 're-media';
            } else if (sKey === 'weddings') {
                inqService.value = 'wedding-video';
            } else if (sKey === 'corporate') {
                inqService.value = 'commercial-video';
            } else if (sKey === 'drone') {
                inqService.value = 'drone-custom';
            }
        }

        var numTotal = parseInt(total.replace(/,/g, ''), 10) || 0;
        if (inqBudget && numTotal > 0) {
            if (numTotal < 300) inqBudget.value = 'under-300';
            else if (numTotal <= 600) inqBudget.value = '300-600';
            else if (numTotal <= 1000) inqBudget.value = '600-1000';
            else if (numTotal <= 2500) inqBudget.value = '1000-2500';
            else inqBudget.value = '2500+';
        }

        if (inqMessage) {
            var lines = [];
            lines.push('=== ONLINE ESTIMATE DETAILS ===');
            lines.push('Service: ' + (sKey ? sKey.toUpperCase() : 'Custom'));
            lines.push('Package: ' + pName);
            if (sqftParam) lines.push('Property Size: ' + Number(sqftParam).toLocaleString() + ' sq ft');
            if (addonsParam) lines.push('Add-Ons: ' + addonsParam.split(';').join(', '));
            if (total) lines.push('Calculated Estimate: $' + total);
            lines.push('===============================');
            lines.push('');
            lines.push('Hi Ryan, I calculated this package online and would like to check your availability for my upcoming shoot!');
            inqMessage.value = lines.join('\n');
        }

        var inqBanner = document.getElementById('calc-applied-banner');
        if (inqBanner) {
            var inqTitle = inqBanner.querySelector('.calc-applied-title span');
            var inqDesc = inqBanner.querySelector('.calc-applied-desc');
            if (inqTitle) inqTitle.textContent = 'Estimate Attached: ' + pName + (total ? ' ($' + total + ')' : '');
            if (inqDesc) inqDesc.textContent = 'Your online estimate has been loaded into your inquiry below. Review and send whenever ready!';
            inqBanner.classList.add('active');
        }
    }

    window.calcDismissBanner = function () {
        var banner = document.getElementById('calc-applied-banner');
        if (banner) {
            banner.classList.remove('active');
        }
    };

    // Initialize on DOM Ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            calcRecalculate();
            checkUrlParameters();
        });
    } else {
        calcRecalculate();
        checkUrlParameters();
    }
})();
