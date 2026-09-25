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
            addons: { twilightReal: false, twilightAi: false, rush: false, staging: false }
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

        // Live synchronize selections to the attached form and live summary card
        if (typeof window.calcSyncForm === 'function') {
            window.calcSyncForm(total, savings);
        }
    };

    // Build Formatted Scope String & Payload
    function generateScopePayload(computedTotal, computedSavings) {
        var total;
        if (computedTotal !== undefined && computedTotal !== null) {
            total = Number(computedTotal).toLocaleString();
        } else {
            var totalEl = document.getElementById('calc-display-total');
            total = totalEl ? totalEl.textContent.trim() : '450';
        }

        var savings = (computedSavings !== undefined && computedSavings !== null) ? computedSavings : 0;

        var summary = {
            serviceKey: currentService,
            serviceName: '',
            packageName: '',
            packageKey: '',
            packageBasePrice: 0,
            delivery: '',
            sqft: sqft,
            sqftDisplay: '',
            addons: [],
            total: total,
            savings: savings,
            mediaChoice: '',
            breakdown: '',
            textMessage: ''
        };

        if (currentService === 'realestate') {
            summary.serviceName = 'Real Estate Photography & Media';
            summary.packageKey = state.realestate.pkg;
            summary.packageName = state.realestate.pkgName;
            summary.packageBasePrice = state.realestate.pkgPrice;

            var choiceRadio = document.querySelector('input[name="mediapro-choice"]:checked');
            var choiceVal = choiceRadio ? choiceRadio.value : 'matterport';
            if (state.realestate.pkg === 'mediapro') {
                summary.mediaChoice = (choiceVal === 'matterport')
                    ? '3D Matterport Tour (includes 2D Floor Plan)'
                    : 'Cinematic Video Walkthrough';
            } else if (state.realestate.pkg === 'elite') {
                summary.mediaChoice = 'Cinematic Video + 3D Matterport Tour Included';
            }

            var isMatterport = (state.realestate.pkg === 'mediapro' && choiceVal === 'matterport') || (state.realestate.pkg === 'elite');
            summary.sqftDisplay = Number(summary.sqft).toLocaleString() + ' sq ft';
            if (summary.sqft > 2500) {
                var extraBlocks = Math.ceil((summary.sqft - 2500) / 500);
                var rate = isMatterport ? 50 : 25;
                summary.sqftDisplay += ' (+$' + (extraBlocks * rate) + (isMatterport ? ' includes Matterport 3D scan' : ' size scale') + ')';
            }

            var twReal = document.getElementById('re-addon-twilight-real');
            if (twReal && twReal.checked) summary.addons.push('Real Twilight (+$150)');
            var twAi = document.getElementById('re-addon-twilight-ai');
            if (twAi && twAi.checked) summary.addons.push('AI Virtual Twilight (+$50)');
            var ru = document.getElementById('re-addon-rush');
            if (ru && ru.checked) {
                summary.addons.push('Express 9 AM Delivery (+$75)');
                summary.delivery = 'Express Next-Morning 9:00 AM Guaranteed';
            } else {
                summary.delivery = '24–48 Hour Turnaround';
            }
            var st = document.getElementById('re-addon-staging');
            if (st && st.checked) summary.addons.push('Virtual Staging (+$70)');

            if (state.realestate.pkg === 'mediapro' && summary.savings === 0) summary.savings = 25;
            if (state.realestate.pkg === 'elite' && summary.savings === 0) summary.savings = 50;

        } else if (currentService === 'weddings') {
            summary.serviceName = 'Wedding Videography';
            summary.packageKey = state.weddings.pkg;
            summary.packageName = state.weddings.pkgName;
            summary.packageBasePrice = state.weddings.pkgPrice;
            summary.delivery = '4–8 Week Full Delivery';

            if (document.getElementById('wed-addon-second') && document.getElementById('wed-addon-second').checked) summary.addons.push('Second Videographer (+$600)');
            if (document.getElementById('wed-addon-raw') && document.getElementById('wed-addon-raw').checked) summary.addons.push('Raw Footage Drive (+$350)');
            var wedTeaser = document.getElementById('wed-addon-teaser');
            if (wedTeaser && wedTeaser.checked) {
                summary.addons.push('48-Hr Instagram Teaser Reel (+$300)');
                summary.delivery = '48-Hr Teaser Reel + 4-8 Wk Feature Film';
            }
            if (document.getElementById('wed-addon-rehearsal') && document.getElementById('wed-addon-rehearsal').checked) summary.addons.push('Rehearsal Dinner Coverage (+$500)');
            if (document.getElementById('wed-addon-booth') && document.getElementById('wed-addon-booth').checked) summary.addons.push('Drunk Advice Booth (+$350)');

        } else if (currentService === 'corporate') {
            summary.serviceName = 'Corporate & Commercial Video';
            summary.packageKey = state.corporate.pkg;
            summary.packageName = state.corporate.pkgName;
            summary.packageBasePrice = state.corporate.pkgPrice;
            summary.delivery = '7–10 Business Days';

            var corpRushPrice = getCorporateRushPrice();
            if (document.getElementById('corp-addon-drone') && document.getElementById('corp-addon-drone').checked) summary.addons.push('Drone Aerial Footage (+$150)');
            if (document.getElementById('corp-addon-extended') && document.getElementById('corp-addon-extended').checked) summary.addons.push('Extended 3-5m Director Cut (+$300)');
            if (document.getElementById('corp-addon-social') && document.getElementById('corp-addon-social').checked) summary.addons.push('Vertical 9:16 Social Cuts (+$150)');
            var corpRush = document.getElementById('corp-addon-rush');
            if (corpRush && corpRush.checked) {
                summary.addons.push('5-Day Rush Delivery (+$' + corpRushPrice + ')');
                summary.delivery = '5-Day Express Rush Delivery';
            }

        } else if (currentService === 'drone') {
            summary.serviceName = 'Drone Aerial Flight';
            summary.packageKey = state.drone.pkg;
            summary.packageName = state.drone.pkgName;
            summary.packageBasePrice = state.drone.pkgPrice;
            summary.delivery = '24–48 Hour Turnaround';

            if (document.getElementById('drone-addon-raw') && document.getElementById('drone-addon-raw').checked) summary.addons.push('Uncut 4K D-Log Video Files (+$75)');
            if (document.getElementById('drone-addon-twilight') && document.getElementById('drone-addon-twilight').checked) summary.addons.push('Sunset / Twilight Flight (+$100)');

            if (state.drone.pkg === 'bundle' && summary.savings === 0) summary.savings = 75;
        }

        // Build itemized breakdown string for Formspree
        var parts = [
            'Service: ' + summary.serviceName,
            'Package: ' + summary.packageName + ' ($' + Number(summary.packageBasePrice).toLocaleString() + ')'
        ];
        if (summary.mediaChoice) parts.push('Choice: ' + summary.mediaChoice);
        if (summary.sqftDisplay) parts.push('Size: ' + summary.sqftDisplay);
        if (summary.delivery) parts.push('Delivery: ' + summary.delivery);
        parts.push('Add-Ons: ' + (summary.addons.length > 0 ? summary.addons.join(', ') : 'None'));
        parts.push('Total: $' + summary.total + (summary.savings > 0 ? ' (Saves $' + summary.savings + ')' : ''));
        summary.breakdown = parts.join(' | ');

        // Build formatted text message for textarea
        var lines = [];
        lines.push('=== ONLINE ESTIMATE DETAILS ===');
        lines.push('Service: ' + summary.serviceName);
        lines.push('Package: ' + summary.packageName + ' ($' + Number(summary.packageBasePrice).toLocaleString() + ')');
        if (summary.sqftDisplay) {
            lines.push('Property Size: ' + summary.sqftDisplay);
        }
        if (summary.mediaChoice) {
            lines.push('Included Choice: ' + summary.mediaChoice);
        }
        if (summary.delivery) {
            lines.push('Turnaround: ' + summary.delivery);
        }
        if (summary.addons.length > 0) {
            lines.push('Selected Add-Ons: ' + summary.addons.join(', '));
        } else {
            lines.push('Selected Add-Ons: None');
        }
        var totalLine = 'Calculated Estimate: $' + summary.total;
        if (summary.savings > 0) {
            totalLine += ' (Bundle Savings: Saves $' + summary.savings + ')';
        }
        lines.push(totalLine);
        lines.push('===============================');
        lines.push('');
        lines.push('Hi Ryan, I calculated this package online and would like to check your availability for my upcoming shoot!');

        summary.textMessage = lines.join('\n');
        return summary;
    }

    // Preserve custom user comments when refreshing the scope breakdown in the message textarea
    function updateMessagePreservingNotes(textarea, newScopeText) {
        if (!textarea) return;
        var currentVal = textarea.value || '';
        var delimiter = '===============================';
        var defaultClosing = 'Hi Ryan, I calculated this package online and would like to check your availability for my upcoming shoot!';
        var defaultClosingAlt = 'Hi Ryan, I calculated this package online and would like to check your availability for my upcoming project!';

        if (currentVal.indexOf(delimiter) !== -1) {
            var parts = currentVal.split(delimiter);
            var afterDelimiter = parts.slice(1).join(delimiter);
            var userText = afterDelimiter.replace(/^\r?\n\r?\n?/, '').trim();

            if (!userText || userText === defaultClosing || userText === defaultClosingAlt) {
                textarea.value = newScopeText;
            } else {
                var newHeader = newScopeText.split(delimiter)[0] + delimiter;
                textarea.value = newHeader + '\n\n' + userText;
            }
        } else if (!currentVal.trim()) {
            textarea.value = newScopeText;
        } else {
            var newHeader = newScopeText.split(delimiter)[0] + delimiter;
            textarea.value = newHeader + '\n\n' + currentVal.trim();
        }
    }

    // Live Synchronize Selections, Scope, and Breakdown into the Form
    window.calcSyncForm = function (computedTotal, computedSavings) {
        var payload = generateScopePayload(computedTotal, computedSavings);

        // 1. Update Live Summary Card if present (estimate.html)
        var cardTotal = document.getElementById('summary-card-total');
        if (cardTotal) cardTotal.textContent = payload.total;

        var cardPkg = document.getElementById('summary-card-pkg');
        if (cardPkg) cardPkg.textContent = payload.packageName + ' ($' + Number(payload.packageBasePrice).toLocaleString() + ')';

        var cardChoiceItem = document.getElementById('summary-card-choice-item');
        var cardChoice = document.getElementById('summary-card-choice');
        if (cardChoiceItem && cardChoice) {
            if (payload.mediaChoice) {
                cardChoiceItem.style.display = '';
                cardChoice.textContent = payload.mediaChoice;
            } else {
                cardChoiceItem.style.display = 'none';
            }
        }

        var cardSqftItem = document.getElementById('summary-card-sqft-item');
        var cardSqft = document.getElementById('summary-card-sqft');
        if (cardSqftItem && cardSqft) {
            if (payload.serviceKey === 'realestate') {
                cardSqftItem.style.display = '';
                cardSqft.textContent = payload.sqftDisplay;
            } else {
                cardSqftItem.style.display = 'none';
            }
        }

        var cardDeliveryItem = document.getElementById('summary-card-delivery-item');
        var cardDelivery = document.getElementById('summary-card-delivery');
        if (cardDeliveryItem && cardDelivery) {
            if (payload.delivery) {
                cardDeliveryItem.style.display = '';
                cardDelivery.textContent = payload.delivery;
            } else {
                cardDeliveryItem.style.display = 'none';
            }
        }

        var cardAddonsList = document.getElementById('summary-card-addons-list');
        if (cardAddonsList) {
            if (payload.addons.length > 0) {
                cardAddonsList.innerHTML = payload.addons.map(function (item) {
                    return '<span class="calc-addon-tag">' + item + '</span>';
                }).join('');
            } else {
                cardAddonsList.innerHTML = '<span class="calc-addon-tag" style="opacity:0.7">None selected</span>';
            }
        }

        // 2. Update Formspree Hidden Inputs
        var hService = document.getElementById('calc-hidden-service');
        if (hService) hService.value = payload.serviceName;

        var hPkg = document.getElementById('calc-hidden-package');
        if (hPkg) hPkg.value = payload.packageName + ' ($' + Number(payload.packageBasePrice).toLocaleString() + ')';

        var hSqft = document.getElementById('calc-hidden-sqft');
        if (hSqft) hSqft.value = (payload.serviceKey === 'realestate' && payload.sqftDisplay) ? payload.sqftDisplay : 'N/A';

        var hChoice = document.getElementById('calc-hidden-choice');
        if (hChoice) hChoice.value = payload.mediaChoice || 'N/A';

        var hAddons = document.getElementById('calc-hidden-addons');
        if (hAddons) hAddons.value = payload.addons.length > 0 ? payload.addons.join('; ') : 'None';

        var hTotal = document.getElementById('calc-hidden-total');
        if (hTotal) hTotal.value = '$' + payload.total;

        var hSavings = document.getElementById('calc-hidden-savings');
        if (hSavings) hSavings.value = payload.savings > 0 ? ('Saves $' + payload.savings) : 'None';

        var hBreakdown = document.getElementById('calc-hidden-breakdown');
        if (hBreakdown) hBreakdown.value = payload.breakdown;

        // 3. Update Target Form Fields (inquiryForm on estimate.html / contact.html or homepageForm on index.html)
        var inqForm = document.getElementById('inquiryForm');
        var homeForm = document.getElementById('homepageForm');
        var targetForm = inqForm || homeForm;

        if (targetForm) {
            // Update Subject line for Formspree notification email
            var subInput = targetForm.querySelector('input[name="_subject"]');
            if (subInput) {
                subInput.value = 'Estimate Inquiry: ' + payload.packageName + ' ($' + payload.total + ') — ' + payload.serviceName;
            }

            // Update Service Select
            var selService = targetForm.querySelector('select[name="service"]');
            if (selService) {
                if (payload.serviceKey === 'realestate') {
                    if (payload.packageKey === 'essential') selService.value = 're-essential';
                    else if (payload.packageKey === 'aerial') selService.value = 're-aerial';
                    else if (payload.packageKey === 'mediapro') selService.value = 're-media';
                    else if (payload.packageKey === 'elite') selService.value = 're-elite';
                    else selService.value = 're-media';
                } else if (payload.serviceKey === 'weddings') {
                    selService.value = 'wedding-video';
                } else if (payload.serviceKey === 'corporate') {
                    if (payload.packageKey === 'recap') selService.value = 'event-recap';
                    else if (payload.packageKey === 'promo' || payload.packageKey === 'halfday') selService.value = 'commercial-video';
                    else if (payload.packageKey === 'fullday') selService.value = 'brand-content';
                    else selService.value = 'commercial-video';
                } else if (payload.serviceKey === 'drone') {
                    if (payload.packageKey === 'photos') selService.value = 'drone-re';
                    else if (payload.packageKey === 'video') selService.value = 'drone-event';
                    else selService.value = 'drone-custom';
                }
            }

            // Update Budget Select
            var selBudget = targetForm.querySelector('select[name="budget"]');
            if (selBudget) {
                var numTotal = parseInt(payload.total.toString().replace(/,/g, ''), 10) || 0;
                if (numTotal < 300) selBudget.value = 'under-300';
                else if (numTotal <= 600) selBudget.value = '300-600';
                else if (numTotal <= 1000) selBudget.value = '600-1000';
                else if (numTotal <= 2500) selBudget.value = '1000-2500';
                else selBudget.value = '2500+';
            }

            // Update Message Textarea with Note Preservation
            var msgTextarea = targetForm.querySelector('textarea[name="message"]');
            if (msgTextarea) {
                updateMessagePreservingNotes(msgTextarea, payload.textMessage);
            }
        }

        return payload;
    };

    // Form Autofill, Visual Feedback & Scroll Action
    window.calcApplyEstimate = function () {
        var payload = window.calcSyncForm();

        var inqForm = document.getElementById('inquiryForm');
        var homeForm = document.getElementById('homepageForm');
        var targetForm = inqForm || homeForm;

        if (targetForm) {
            // Show applied banner if present
            var banner = document.getElementById('calc-applied-banner');
            if (banner) {
                var titleEl = banner.querySelector('.calc-applied-title span');
                var descEl = banner.querySelector('.calc-applied-desc');
                if (titleEl) titleEl.textContent = 'Estimate Attached: ' + payload.packageName + ' ($' + payload.total + ')';
                if (descEl) descEl.textContent = 'Your estimated package details and scope have been synced below. Review your shoot details and send anytime!';
                banner.classList.add('active');
            }

            // Scroll down smoothly to booking form
            var bookingWrap = document.getElementById('bookingFormSection') || targetForm.closest('.inquiry-form') || targetForm;
            if (bookingWrap) {
                bookingWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            // Trigger visual pulse glow on the form container
            var formBox = targetForm.closest('.inquiry-form') || targetForm.closest('.contact-form') || targetForm;
            if (formBox) {
                formBox.classList.remove('calc-form-highlight');
                void formBox.offsetWidth; // force reflow
                formBox.classList.add('calc-form-highlight');
            }

            // Focus the first name field after scrolling
            setTimeout(function () {
                var firstInput = targetForm.querySelector('#fname') || targetForm.querySelector('#name') || targetForm.querySelector('input[type="text"]:not([style*="display:none"])');
                if (firstInput) firstInput.focus();
            }, 600);

            return;
        }

        // 3. If neither form is present on this page, redirect to contact.html with query parameters
        var query = new URLSearchParams({
            service: payload.serviceKey,
            pkg: payload.packageKey,
            name: payload.packageName,
            sqft: payload.sqft,
            total: payload.total,
            choice: payload.mediaChoice || '',
            delivery: payload.delivery || '',
            addons: payload.addons.join(';')
        });
        window.location.href = 'contact.html?' + query.toString() + '#inquiryForm';
    };

    // Check URL parameters on page load (for contact.html and estimate.html)
    function checkUrlParameters() {
        var params = new URLSearchParams(window.location.search);
        var sKey = params.get('service');
        var pKey = params.get('pkg');
        var sqftParam = params.get('sqft');

        if (sKey && ['realestate', 'weddings', 'corporate', 'drone'].indexOf(sKey) !== -1) {
            calcSwitchService(sKey);
        }

        if (pKey) {
            if (sKey === 'realestate' || !sKey) {
                if (pKey === 'essential') calcSelectRealEstatePackage('essential', 200, 'Essential Photography');
                else if (pKey === 'aerial') calcSelectRealEstatePackage('aerial', 300, 'Aerial Pro');
                else if (pKey === 'mediapro') calcSelectRealEstatePackage('mediapro', 450, 'Media Pro');
                else if (pKey === 'elite') calcSelectRealEstatePackage('elite', 800, 'Elite Full Media');
            } else if (sKey === 'weddings') {
                if (pKey === 'highlight') calcSelectWeddingPackage('highlight', 2500, 'Highlight Film');
                else if (pKey === 'cinema') calcSelectWeddingPackage('cinema', 4000, 'Cinema Feature Film');
                else if (pKey === 'ultimate') calcSelectWeddingPackage('ultimate', 5500, 'Ultimate Experience');
            } else if (sKey === 'corporate') {
                if (pKey === 'recap') calcSelectCorporatePackage('recap', 1000, 'Event Recap Video');
                else if (pKey === 'promo') calcSelectCorporatePackage('promo', 1000, 'Brand Commercial Promo');
                else if (pKey === 'halfday') calcSelectCorporatePackage('halfday', 1500, 'Half-Day Brand Story');
                else if (pKey === 'fullday') calcSelectCorporatePackage('fullday', 2500, 'Full-Day Production');
            } else if (sKey === 'drone') {
                if (pKey === 'photos') calcSelectDronePackage('photos', 150, 'Aerial Stills Package');
                else if (pKey === 'video') calcSelectDronePackage('video', 200, 'Aerial 4K Video Reel');
                else if (pKey === 'bundle') calcSelectDronePackage('bundle', 275, 'Full Aerial Stills + Video Bundle');
            }
        }

        if (sqftParam) {
            var slider = document.getElementById('calc-slider-sqft');
            if (slider) {
                slider.value = sqftParam;
                calcUpdateSqft(sqftParam);
            }
        }

        // Re-sync after processing query parameters
        window.calcSyncForm();
    }

    window.calcDismissBanner = function () {
        var banner = document.getElementById('calc-applied-banner');
        if (banner) {
            banner.classList.remove('active');
        }
    };

    // Ensure form submit event captures the latest calculator values
    function initFormSubmitSync() {
        var form = document.getElementById('inquiryForm') || document.getElementById('homepageForm');
        if (form) {
            form.addEventListener('submit', function () {
                window.calcSyncForm();
            });
        }
    }

    // Initialize on DOM Ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            calcRecalculate();
            checkUrlParameters();
            initFormSubmitSync();
        });
    } else {
        calcRecalculate();
        checkUrlParameters();
        initFormSubmitSync();
    }
})();
