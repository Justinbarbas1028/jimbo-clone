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
    const languageButton = document.getElementById('lang-btn')
    const languageListbox = document.getElementById('lang-listbox')
    const languageChevron = document.getElementById('lang-chevron')
    const languageLabel = document.getElementById('lang-label')

    if (languageButton && languageListbox) {
        languageButton.addEventListener('click', (event) => {
            event.stopPropagation()
            const isOpen = !languageListbox.classList.contains('hidden')
            languageListbox.classList.toggle('hidden', isOpen)
            languageButton.setAttribute('aria-expanded', String(!isOpen))
            languageChevron.style.transform = isOpen ? '' : 'rotate(180deg)'
        })

        document.querySelectorAll('.lang-option').forEach((option) => {
            option.addEventListener('click', () => {
                const selectedLanguage = option.getAttribute('data-lang')
                languageLabel.textContent = selectedLanguage
                document
                    .querySelectorAll('.lang-option')
                    .forEach((otherOption) => otherOption.setAttribute('aria-selected', 'false'))
                option.setAttribute('aria-selected', 'true')
                languageListbox.classList.add('hidden')
                languageButton.setAttribute('aria-expanded', 'false')
                languageChevron.style.transform = ''
            })
        })

        document.addEventListener('click', () => {
            languageListbox.classList.add('hidden')
            languageButton.setAttribute('aria-expanded', 'false')
            languageChevron.style.transform = ''
        })
    }

    // Mobile accordion
    document
        .querySelectorAll('.mobile-acc-chevron')
        .forEach((chevron) => (chevron.style.transform = 'rotate(-90deg)'))

    document.querySelectorAll('.mobile-accordion').forEach((accordionItem) => {
        const accordionTrigger = accordionItem.querySelector('.mobile-acc-trigger')
        const accordionPanel = accordionItem.querySelector('.mobile-acc-panel')
        const accordionChevron = accordionItem.querySelector('.mobile-acc-chevron')
        accordionTrigger.addEventListener('click', () => {
            const isOpen = !accordionPanel.classList.contains('hidden')
            // Close all other panels
            document.querySelectorAll('.mobile-acc-panel').forEach((panel) => panel.classList.add('hidden'))
            document
                .querySelectorAll('.mobile-acc-chevron')
                .forEach((chevron) => (chevron.style.transform = 'rotate(-90deg)'))
            if (!isOpen) {
                accordionPanel.classList.remove('hidden')
                accordionChevron.style.transform = 'rotate(90deg)'
            }
        })
    })

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
        const getVisibleSlideCount = () => (window.innerWidth < MOBILE_BREAKPOINT ? 1 : 3)

        const activeItemIndex = 1
        let visibleSlideCount = getVisibleSlideCount()
        let itemWidth = 0
        let baseTrackOffset = 0
        let trackOffset = 0
        let isAnimating = false
        const trackTransition = 'transform 200ms cubic-bezier(0.25, 0.1, 0.25, 1)'
        const slideTransition =
            'transform 200ms cubic-bezier(0.25, 0.1, 0.25, 1), opacity 200ms cubic-bezier(0.25, 0.1, 0.25, 1)'

        let centerSlideIndex = Math.floor(visibleSlideCount / 2)
        const totalItems = track.children.length
        const getPortfolioSlides = () => Array.from(track.querySelectorAll('.portfolio-slide-item'))
        const toPixelString = (value) => `${value.toFixed(3)}px`

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
            const slides = getPortfolioSlides()
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
            const slides = getPortfolioSlides()
            if (!slides.length) return

            const trackStyles = window.getComputedStyle(track)
            const gap = parseFloat(trackStyles.columnGap || trackStyles.gap || '0')
            itemWidth = Math.round((slides[0].getBoundingClientRect().width + gap) * 1000) / 1000

            baseTrackOffset = -(activeItemIndex - centerSlideIndex) * itemWidth
            trackOffset = baseTrackOffset
            track.style.transition = 'none'
            track.style.transform = `translateX(${toPixelString(trackOffset)})`

            updateScaling(activeItemIndex, false)
            updatePortfolioPagination()

            requestAnimationFrame(() => {
                track.style.transition = trackTransition
            })
        }

        const moveToNextSlide = () => {
            if (isAnimating || totalItems < 2 || itemWidth === 0) return
            isAnimating = true

            trackOffset = baseTrackOffset - itemWidth
            updateScaling(activeItemIndex + 1)
            track.style.transition = trackTransition
            track.style.transform = `translateX(${toPixelString(trackOffset)})`

            const handleNextTransitionEnd = (event) => {
                if (event.target !== track || event.propertyName !== 'transform') return
                track.removeEventListener('transitionend', handleNextTransitionEnd)

                const firstSlide = track.firstElementChild
                if (firstSlide) {
                    const firstClone = firstSlide.cloneNode(true)
                    track.appendChild(firstClone)
                    firstSlide.remove()
                }

                track.style.transition = 'none'
                trackOffset = baseTrackOffset
                track.style.transform = `translateX(${toPixelString(trackOffset)})`

                updateScaling(activeItemIndex, false)
                updatePortfolioPagination()

                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        track.style.transition = trackTransition
                        isAnimating = false
                    })
                })
            }

            track.addEventListener('transitionend', handleNextTransitionEnd)
        }

        const moveToPreviousSlide = () => {
            if (isAnimating || totalItems < 2 || itemWidth === 0) return
            const lastSlide = track.lastElementChild
            if (!lastSlide) return

            isAnimating = true

            const lastClone = lastSlide.cloneNode(true)
            track.insertBefore(lastClone, track.firstElementChild)

            trackOffset = baseTrackOffset - itemWidth
            track.style.transition = 'none'
            track.style.transform = `translateX(${toPixelString(trackOffset)})`
            lastSlide.remove()

            void track.offsetHeight
            updateScaling(activeItemIndex + 1)

            track.style.transition = trackTransition
            trackOffset = baseTrackOffset
            track.style.transform = `translateX(${toPixelString(trackOffset)})`

            const handlePrevTransitionEnd = (event) => {
                if (event.target !== track || event.propertyName !== 'transform') return
                track.removeEventListener('transitionend', handlePrevTransitionEnd)

                updateScaling(activeItemIndex, false)
                updatePortfolioPagination()
                isAnimating = false
            }

            track.addEventListener('transitionend', handlePrevTransitionEnd)
        }

        prevBtn?.addEventListener('click', (event) => {
            event.preventDefault()
            moveToPreviousSlide()
        })

        nextBtn?.addEventListener('click', (event) => {
            event.preventDefault()
            moveToNextSlide()
        })

        portfolioCarousel.addEventListener('contextmenu', (event) => {
            event.preventDefault()
            moveToNextSlide()
        })

        let resizeDebounceTimer
        window.addEventListener('resize', () => {
            clearTimeout(resizeDebounceTimer)
            resizeDebounceTimer = setTimeout(() => {
                if (isAnimating) return

                const newVisibleSlideCount = getVisibleSlideCount()
                if (newVisibleSlideCount !== visibleSlideCount) {
                    visibleSlideCount = newVisibleSlideCount
                    centerSlideIndex = Math.floor(visibleSlideCount / 2)
                }

                measureCarousel()
            }, 150)
        })

        measureCarousel()
    }
})
