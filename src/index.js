document.addEventListener('DOMContentLoaded', () => {
    // Desktop dropdowns
    const dropdowns = document.querySelectorAll('el-dropdown')
    dropdowns.forEach((dropdown) => {
        const button = dropdown.querySelector('[data-nav-trigger]')
        const menu = dropdown.querySelector('el-menu[popover]')
        if (!button || !menu) return
        menu.addEventListener('toggle', (event) => {
            button.dataset.open = event.newState === 'open' ? 'true' : 'false'
        })
    })

    // Mobile hamburger toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn')
    const mobileMenu = document.getElementById('mobile-menu')
    const mobileMenuBackdrop = document.getElementById('mobile-menu-backdrop')
    const topNav = document.getElementById('top-nav')
    const mobileSignup = document.getElementById('mobile-signup')
    const hamburgerLines = mobileMenuBtn.querySelectorAll('.hamburger-line')
    let mobileMenuOpen = false

    // Reset drill-down state helper (used before drill-down elements are queried)
    const resetDrilldown = () => {
        const mainContent = document.getElementById('mobile-menu-main')
        const header = document.getElementById('mobile-drilldown-header')
        const footer = document.querySelector('#mobile-menu > div.sticky')
        const activePanel = document.getElementById('mobile-drilldown-panel')
        if (mainContent) mainContent.classList.remove('hidden')
        if (header) {
            header.classList.add('hidden')
            header.classList.remove('flex')
        }
        if (footer) footer.classList.remove('hidden')
        if (activePanel) activePanel.remove()
        document.querySelectorAll('.mobile-acc-panel').forEach((p) => p.classList.add('hidden'))
    }

    const setMobileMenuState = (isOpen) => {
        mobileMenu.classList.toggle('hidden', !isOpen)
        mobileMenuBackdrop?.classList.toggle('hidden', !isOpen)
        mobileMenuBtn.setAttribute('aria-expanded', String(isOpen))

        topNav?.classList.toggle('bg-white', !isOpen)
        topNav?.classList.toggle('border-b', !isOpen)
        topNav?.classList.toggle('border-gray-200', !isOpen)
        topNav?.classList.toggle('shadow-sm', !isOpen)

        topNav?.classList.toggle('bg-transparent', isOpen)
        topNav?.classList.toggle('border-transparent', isOpen)
        topNav?.classList.toggle('shadow-none', isOpen)

        mobileSignup?.classList.toggle('hidden', isOpen)
    }

    mobileMenuBackdrop?.addEventListener('click', () => {
        if (!mobileMenuOpen) return

        mobileMenuOpen = false
        setMobileMenuState(false)
        resetDrilldown()
        hamburgerLines[0].style.transform = ''
        hamburgerLines[1].style.opacity = ''
        hamburgerLines[2].style.transform = ''
    })

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuOpen = !mobileMenuOpen
        setMobileMenuState(mobileMenuOpen)
        if (!mobileMenuOpen) resetDrilldown()
        // Animate hamburger to X
        if (mobileMenuOpen) {
            hamburgerLines[0].style.transform = 'translateY(8px) rotate(45deg)'
            hamburgerLines[1].style.opacity = '0'
            hamburgerLines[2].style.transform = 'translateY(-8px) rotate(-45deg)'
        } else {
            hamburgerLines[0].style.transform = ''
            hamburgerLines[1].style.opacity = ''
            hamburgerLines[2].style.transform = ''
        }
    })

    // Language selector
    const langSelector = document.getElementById('lang-selector')
    const langBtn = document.getElementById('lang-btn')
    const langListbox = document.getElementById('lang-listbox')
    const langChevron = document.getElementById('lang-chevron')
    const langLabel = document.getElementById('lang-label')

    if (langSelector && langBtn && langListbox && langChevron && langLabel) {
        const openLangListbox = () => {
            langListbox.classList.remove('hidden')
            langBtn.setAttribute('aria-expanded', 'true')
            langChevron.style.transform = 'rotate(180deg)'
        }

        const closeLangListbox = () => {
            langListbox.classList.add('hidden')
            langBtn.setAttribute('aria-expanded', 'false')
            langChevron.style.transform = ''
        }

        const toggleLangListbox = () => {
            const isOpen = !langListbox.classList.contains('hidden')
            if (isOpen) {
                closeLangListbox()
                return
            }
            openLangListbox()
        }

        const supportsHover = window.matchMedia('(hover: hover)').matches
        if (supportsHover) {
            langSelector.addEventListener('mouseenter', openLangListbox)
            langSelector.addEventListener('mouseleave', closeLangListbox)
        }

        langBtn.addEventListener('click', (e) => {
            e.stopPropagation()
            if (supportsHover) {
                openLangListbox()
                return
            }
            toggleLangListbox()
        })

        document.querySelectorAll('.lang-option').forEach((option) => {
            option.addEventListener('click', () => {
                const selected = option.getAttribute('data-lang')
                langLabel.textContent = selected
                document
                    .querySelectorAll('.lang-option')
                    .forEach((o) => o.setAttribute('aria-selected', 'false'))
                option.setAttribute('aria-selected', 'true')
                closeLangListbox()
            })
        })

        document.addEventListener('click', (event) => {
            if (langSelector.contains(event.target)) return
            closeLangListbox()
        })
    }

    // Mobile drill-down navigation
    const mobileMenuMain = document.getElementById('mobile-menu-main')
    const drilldownHeader = document.getElementById('mobile-drilldown-header')
    const mobileBackBtn = document.getElementById('mobile-back-btn')
    const mobileLoginFooter = document.querySelector('#mobile-menu > div.sticky')

    document
        .querySelectorAll('.mobile-acc-chevron')
        .forEach((chevron) => (chevron.style.transform = 'rotate(-90deg)'))

    const closeDrilldown = () => {
        // Show main menu content
        mobileMenuMain.classList.remove('hidden')
        // Hide drill-down header
        drilldownHeader.classList.add('hidden')
        drilldownHeader.classList.remove('flex')
        // Show login footer
        if (mobileLoginFooter) mobileLoginFooter.classList.remove('hidden')
        // Hide all panels
        document.querySelectorAll('.mobile-acc-panel').forEach((p) => p.classList.add('hidden'))
        document
            .querySelectorAll('.mobile-acc-chevron')
            .forEach((c) => (c.style.transform = 'rotate(-90deg)'))
        // Remove any active drilldown panel
        const activePanel = document.getElementById('mobile-drilldown-panel')
        if (activePanel) activePanel.remove()
    }

    mobileBackBtn?.addEventListener('click', closeDrilldown)

    document.querySelectorAll('.mobile-accordion').forEach((item) => {
        const trigger = item.querySelector('.mobile-acc-trigger')
        const panel = item.querySelector('.mobile-acc-panel')
        if (!trigger || !panel) return

        trigger.addEventListener('click', () => {
            // Hide main menu content
            mobileMenuMain.classList.add('hidden')
            // Hide login footer
            if (mobileLoginFooter) mobileLoginFooter.classList.add('hidden')
            // Show drill-down header
            drilldownHeader.classList.remove('hidden')
            drilldownHeader.classList.add('flex')
            // Remove old drilldown panel if existing
            const oldPanel = document.getElementById('mobile-drilldown-panel')
            if (oldPanel) oldPanel.remove()
            // Clone the panel content into a new visible container
            const drillPanel = panel.cloneNode(true)
            drillPanel.id = 'mobile-drilldown-panel'
            drillPanel.classList.remove('hidden')
            drillPanel.classList.add('flex', 'flex-col', 'px-6', 'py-4', 'overflow-y-auto')
            // Insert after drill-down header
            drilldownHeader.insertAdjacentElement('afterend', drillPanel)
        })
    })

    // Footer accordion toggle (Products, About us, Resources)
    document.querySelectorAll('.footer-accordion').forEach((item) => {
        const trigger = item.querySelector('.footer-acc-trigger')
        const panel = item.querySelector('.footer-acc-panel')
        const chevron = item.querySelector('.footer-acc-chevron')
        if (!trigger || !panel) return

        trigger.addEventListener('click', () => {
            const isOpen = !panel.classList.contains('hidden')
            // Close all footer accordions first
            document.querySelectorAll('.footer-accordion').forEach((acc) => {
                const p = acc.querySelector('.footer-acc-panel')
                const c = acc.querySelector('.footer-acc-chevron')
                if (p) p.classList.add('hidden')
                if (c) c.style.transform = ''
            })
            // If it was closed, open this one
            if (!isOpen) {
                panel.classList.remove('hidden')
                if (chevron) chevron.style.transform = 'rotate(180deg)'
            }
        })
    })

    // Worry-free websites switcher
    const worrySection = document.getElementById('worry-free-websites')
    if (worrySection) {
        const worryButtons = Array.from(worrySection.querySelectorAll('[data-worry-item]'))
        const previewMedia = document.getElementById('worry-preview-media')
        const previewImage = document.getElementById('worry-preview-image')
        const previewText = document.getElementById('worry-preview-text')

        if (worryButtons.length && previewMedia && previewImage && previewText) {
            worryButtons.forEach((button) => {
                const imageSrc = button.getAttribute('data-image')
                if (!imageSrc) return
                const preloadedImage = new Image()
                preloadedImage.src = imageSrc
            })

            let activeButton =
                worryButtons.find((button) => button.classList.contains('is-active')) ||
                worryButtons[0]
            let transitionFrame = null

            const setActiveButton = (targetButton) => {
                worryButtons.forEach((button) => {
                    const isActive = button === targetButton
                    button.classList.toggle('is-active', isActive)
                    button.setAttribute('aria-pressed', isActive ? 'true' : 'false')
                })
                activeButton = targetButton
            }

            const switchPreview = (targetButton) => {
                if (!targetButton || targetButton === activeButton) return

                const nextImage = targetButton.getAttribute('data-image')
                const nextAlt = targetButton.getAttribute('data-alt') || ''
                const nextDescription = targetButton.getAttribute('data-description') || ''
                if (!nextImage || !nextDescription) return

                setActiveButton(targetButton)
                previewMedia.classList.add('is-out')
                previewText.classList.add('is-out')

                window.clearTimeout(transitionFrame)
                transitionFrame = window.setTimeout(() => {
                    previewImage.src = nextImage
                    previewImage.alt = nextAlt
                    previewText.textContent = nextDescription

                    window.requestAnimationFrame(() => {
                        previewMedia.classList.remove('is-out')
                        previewText.classList.remove('is-out')
                    })
                }, 180)
            }

            setActiveButton(activeButton)
            worryButtons.forEach((button) => {
                button.addEventListener('click', () => {
                    switchPreview(button)
                })
            })
        }
    }

    // Portfolio carousel
    const portfolioCarousel = document.getElementById('portfolio-carousel')
    if (portfolioCarousel) {
        const track = document.getElementById('portfolio-track')
        const prevBtn = document.getElementById('portfolio-prev')
        const nextBtn = document.getElementById('portfolio-next')
        const paginatorDots = Array.from(document.querySelectorAll('[data-portfolio-dot]'))
        if (!track) {
            return
        }

        const MOBILE_BREAKPOINT = 768
        const getVisibleWindow = () => (window.innerWidth < MOBILE_BREAKPOINT ? 1 : 3)

        const activeItemIndex = 1
        let visibleWindow = getVisibleWindow()
        let itemWidth = 0
        let baseTrackOffset = 0
        let trackOffset = 0
        let isAnimating = false
        const trackTransition = 'transform 200ms cubic-bezier(0.25, 0.1, 0.25, 1)'
        const slideTransition =
            'transform 200ms cubic-bezier(0.25, 0.1, 0.25, 1), opacity 200ms cubic-bezier(0.25, 0.1, 0.25, 1)'

        let centerWindowIndex = Math.floor(visibleWindow / 2)
        const totalItems = track.children.length
        const getSlides = () => Array.from(track.querySelectorAll('.portfolio-slide-item'))
        const toPx = (value) => `${value.toFixed(3)}px`

        const updatePortfolioPagination = () => {
            if (!paginatorDots.length) return

            const activeSlide = track.children[activeItemIndex]
            const activeDotIndex = Number(activeSlide?.dataset.itemId ?? 0)

            paginatorDots.forEach((dot, index) => {
                const isActive = index === activeDotIndex
                dot.classList.toggle('bg-[#004ced]', isActive)
                dot.classList.toggle('bg-gray-300', !isActive)
                dot.setAttribute('aria-current', isActive ? 'true' : 'false')
            })
        }

        const updateScaling = (centerIndex = activeItemIndex, animate = true) => {
            const slides = getSlides()
            slides.forEach((slide, index) => {
                slide.classList.add('transform')
                if (animate) {
                    slide.style.transition = slideTransition
                } else {
                    slide.style.transition = 'none'
                }
                slide.classList.remove(
                    'scale-100',
                    'scale-85',
                    'opacity-100',
                    'opacity-60',
                    'z-30',
                    'z-10'
                )

                if (index === centerIndex) {
                    slide.classList.add('scale-100', 'opacity-100', 'z-30')
                } else {
                    slide.classList.add('scale-85', 'opacity-60', 'z-10')
                }
            })
        }

        const measureCarousel = () => {
            const slides = getSlides()
            if (!slides.length) return

            const trackStyles = window.getComputedStyle(track)
            const gap = parseFloat(trackStyles.columnGap || trackStyles.gap || '0')

            // For mobile, itemWidth should be the viewport width since it's 100vw
            if (visibleWindow === 1) {
                itemWidth = window.innerWidth
            } else {
                itemWidth =
                    Math.round((slides[0].getBoundingClientRect().width + gap) * 1000) / 1000
            }

            baseTrackOffset = -(activeItemIndex - centerWindowIndex) * itemWidth
            trackOffset = baseTrackOffset
            track.style.transition = 'none'
            track.style.transform = `translateX(${toPx(trackOffset)})`

            updateScaling(activeItemIndex, false)
            updatePortfolioPagination()

            requestAnimationFrame(() => {
                track.style.transition = trackTransition
            })
        }

        const moveNext = () => {
            if (isAnimating || totalItems < 2 || itemWidth === 0) return
            isAnimating = true

            trackOffset = baseTrackOffset - itemWidth
            updateScaling(activeItemIndex + 1)
            track.style.transition = trackTransition
            track.style.transform = `translateX(${toPx(trackOffset)})`

            const handleNextEnd = (event) => {
                if (event.target !== track || event.propertyName !== 'transform') return
                track.removeEventListener('transitionend', handleNextEnd)

                const firstSlide = track.firstElementChild
                if (firstSlide) {
                    const firstClone = firstSlide.cloneNode(true)
                    track.appendChild(firstClone)
                    firstSlide.remove()
                }

                track.style.transition = 'none'
                trackOffset = baseTrackOffset
                track.style.transform = `translateX(${toPx(trackOffset)})`

                updateScaling(activeItemIndex, false)
                updatePortfolioPagination()

                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        track.style.transition = trackTransition
                        isAnimating = false
                    })
                })
            }

            track.addEventListener('transitionend', handleNextEnd)
        }

        const movePrev = () => {
            if (isAnimating || totalItems < 2 || itemWidth === 0) return
            const lastSlide = track.lastElementChild
            if (!lastSlide) return

            isAnimating = true

            const lastClone = lastSlide.cloneNode(true)
            track.insertBefore(lastClone, track.firstElementChild)

            trackOffset = baseTrackOffset - itemWidth
            track.style.transition = 'none'
            track.style.transform = `translateX(${toPx(trackOffset)})`
            lastSlide.remove()

            void track.offsetHeight
            updateScaling(activeItemIndex + 1)

            track.style.transition = trackTransition
            trackOffset = baseTrackOffset
            track.style.transform = `translateX(${toPx(trackOffset)})`

            const handlePrevEnd = (event) => {
                if (event.target !== track || event.propertyName !== 'transform') return
                track.removeEventListener('transitionend', handlePrevEnd)

                updateScaling(activeItemIndex, false)
                updatePortfolioPagination()
                isAnimating = false
            }

            track.addEventListener('transitionend', handlePrevEnd)
        }

        prevBtn?.addEventListener('click', (event) => {
            event.preventDefault()
            movePrev()
        })

        nextBtn?.addEventListener('click', (event) => {
            event.preventDefault()
            moveNext()
        })

        portfolioCarousel.addEventListener('contextmenu', (event) => {
            event.preventDefault()
            moveNext()
        })

        // Drag / swipe support
        let isDragging = false
        let dragStartX = 0
        let dragCurrentX = 0
        const DRAG_THRESHOLD = 50

        const getPointerX = (e) => (e.touches ? e.touches[0].clientX : e.clientX)

        const onDragStart = (e) => {
            if (isAnimating) return
            isDragging = true
            dragStartX = getPointerX(e)
            dragCurrentX = dragStartX
            track.style.transition = 'none'
            track.style.cursor = 'grabbing'
        }

        const onDragMove = (e) => {
            if (!isDragging) return
            dragCurrentX = getPointerX(e)
            const delta = dragCurrentX - dragStartX
            track.style.transform = `translateX(${toPx(baseTrackOffset + delta)})`
        }

        const onDragEnd = () => {
            if (!isDragging) return
            isDragging = false
            track.style.cursor = ''
            const delta = dragCurrentX - dragStartX

            if (Math.abs(delta) > DRAG_THRESHOLD) {
                if (delta < 0) {
                    moveNext()
                } else {
                    movePrev()
                }
            } else {
                // Snap back
                track.style.transition = trackTransition
                track.style.transform = `translateX(${toPx(baseTrackOffset)})`
            }
        }

        // Mouse events
        portfolioCarousel.addEventListener('mousedown', onDragStart)
        window.addEventListener('mousemove', onDragMove)
        window.addEventListener('mouseup', onDragEnd)

        // Touch events
        portfolioCarousel.addEventListener('touchstart', onDragStart, { passive: true })
        window.addEventListener('touchmove', onDragMove, { passive: true })
        window.addEventListener('touchend', onDragEnd)

        // Prevent image ghost drag
        track.addEventListener('dragstart', (e) => e.preventDefault())

        let resizeTimeout
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout)
            resizeTimeout = setTimeout(() => {
                if (isAnimating) return

                const newVisibleWindow = getVisibleWindow()
                if (newVisibleWindow !== visibleWindow) {
                    visibleWindow = newVisibleWindow
                    centerWindowIndex = Math.floor(visibleWindow / 2)
                }

                measureCarousel()
            }, 150)
        })

        measureCarousel()
    }
})
