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
        hamburgerLines[0].style.transform = ''
        hamburgerLines[1].style.opacity = ''
        hamburgerLines[2].style.transform = ''
    })

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuOpen = !mobileMenuOpen
        setMobileMenuState(mobileMenuOpen)
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
    const langBtn = document.getElementById('lang-btn')
    const langListbox = document.getElementById('lang-listbox')
    const langChevron = document.getElementById('lang-chevron')
    const langLabel = document.getElementById('lang-label')

    if (langBtn && langListbox) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation()
            const isOpen = !langListbox.classList.contains('hidden')
            langListbox.classList.toggle('hidden', isOpen)
            langBtn.setAttribute('aria-expanded', String(!isOpen))
            langChevron.style.transform = isOpen ? '' : 'rotate(180deg)'
        })

        document.querySelectorAll('.lang-option').forEach((option) => {
            option.addEventListener('click', () => {
                const selected = option.getAttribute('data-lang')
                langLabel.textContent = selected
                document
                    .querySelectorAll('.lang-option')
                    .forEach((o) => o.setAttribute('aria-selected', 'false'))
                option.setAttribute('aria-selected', 'true')
                langListbox.classList.add('hidden')
                langBtn.setAttribute('aria-expanded', 'false')
                langChevron.style.transform = ''
            })
        })

        document.addEventListener('click', () => {
            langListbox.classList.add('hidden')
            langBtn.setAttribute('aria-expanded', 'false')
            langChevron.style.transform = ''
        })
    }

    // Mobile accordion
    document
        .querySelectorAll('.mobile-acc-chevron')
        .forEach((chevron) => (chevron.style.transform = 'rotate(-90deg)'))

    document.querySelectorAll('.mobile-accordion').forEach((item) => {
        const trigger = item.querySelector('.mobile-acc-trigger')
        const panel = item.querySelector('.mobile-acc-panel')
        const chevron = item.querySelector('.mobile-acc-chevron')
        trigger.addEventListener('click', () => {
            const isOpen = !panel.classList.contains('hidden')
            // Close all other panels
            document.querySelectorAll('.mobile-acc-panel').forEach((p) => p.classList.add('hidden'))
            document
                .querySelectorAll('.mobile-acc-chevron')
                .forEach((c) => (c.style.transform = 'rotate(-90deg)'))
            if (!isOpen) {
                panel.classList.remove('hidden')
                chevron.style.transform = 'rotate(90deg)'
            }
        })
    })

    // Portfolio carousel
    const portfolioCarousel = document.getElementById('portfolio-carousel')
    if (portfolioCarousel) {
        const track = document.getElementById('portfolio-track')
        const prevBtn = document.getElementById('portfolio-prev')
        const nextBtn = document.getElementById('portfolio-next')
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
            itemWidth = Math.round((slides[0].getBoundingClientRect().width + gap) * 1000) / 1000

            baseTrackOffset = -(activeItemIndex - centerWindowIndex) * itemWidth
            trackOffset = baseTrackOffset
            track.style.transition = 'none'
            track.style.transform = `translateX(${toPx(trackOffset)})`

            updateScaling(activeItemIndex, false)

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
