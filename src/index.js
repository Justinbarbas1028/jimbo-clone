const queryAll = (selector, root = document) => Array.from(root.querySelectorAll(selector))

const toggleClasses = (element, classNames, isActive) => {
    if (!element) return

    classNames.forEach((className) => {
        element.classList.toggle(className, isActive)
    })
}

function initializeNavigationDropdowns() {
    queryAll('el-dropdown').forEach((dropdown) => {
        const trigger = dropdown.querySelector('[data-nav-trigger]')
        const menu = dropdown.querySelector('el-menu[popover]')

        if (!trigger || !menu) return

        menu.addEventListener('toggle', ({ newState }) => {
            trigger.dataset.open = newState === 'open' ? 'true' : 'false'
        })
    })
}

function initializeMobileDrilldown() {
    const mobileMenuMain = document.getElementById('mobile-menu-main')
    const drilldownHeader = document.getElementById('mobile-drilldown-header')
    const mobileBackButton = document.getElementById('mobile-back-btn')
    const mobileFooter = document.querySelector('#mobile-menu > div.sticky')
    const mobileChevrons = queryAll('.mobile-acc-chevron')

    const removeActiveDrilldownPanel = () => {
        const activePanel = document.getElementById('mobile-drilldown-panel')
        activePanel?.remove()
    }

    const resetDrilldown = () => {
        mobileMenuMain?.classList.remove('hidden')

        if (drilldownHeader) {
            drilldownHeader.classList.add('hidden')
            drilldownHeader.classList.remove('flex')
        }

        mobileFooter?.classList.remove('hidden')
        removeActiveDrilldownPanel()

        queryAll('.mobile-acc-panel').forEach((panel) => {
            panel.classList.add('hidden')
        })

        mobileChevrons.forEach((chevron) => {
            chevron.style.transform = 'rotate(-90deg)'
        })
    }

    mobileBackButton?.addEventListener('click', resetDrilldown)
    resetDrilldown()

    queryAll('.mobile-accordion').forEach((accordion) => {
        const trigger = accordion.querySelector('.mobile-acc-trigger')
        const panel = accordion.querySelector('.mobile-acc-panel')

        if (!trigger || !panel) return

        trigger.addEventListener('click', () => {
            if (!mobileMenuMain || !drilldownHeader) return

            mobileMenuMain.classList.add('hidden')
            mobileFooter?.classList.add('hidden')
            drilldownHeader.classList.remove('hidden')
            drilldownHeader.classList.add('flex')
            removeActiveDrilldownPanel()

            // The source accordion stays hidden in the main menu, so clone its panel into
            // a dedicated container that can fill the drilldown view.
            const drilldownPanel = panel.cloneNode(true)
            drilldownPanel.id = 'mobile-drilldown-panel'
            drilldownPanel.classList.remove('hidden')
            drilldownPanel.classList.add('flex', 'flex-col', 'px-6', 'py-4', 'overflow-y-auto')

            drilldownHeader.insertAdjacentElement('afterend', drilldownPanel)
        })
    })

    return resetDrilldown
}

function initializeMobileMenu(resetDrilldown) {
    const mobileMenuButton = document.getElementById('mobile-menu-btn')
    const mobileMenu = document.getElementById('mobile-menu')
    const mobileMenuBackdrop = document.getElementById('mobile-menu-backdrop')
    const topNav = document.getElementById('top-nav')
    const mobileSignup = document.getElementById('mobile-signup')
    const hamburgerLines = Array.from(mobileMenuButton?.querySelectorAll('.hamburger-line') ?? [])

    if (!mobileMenuButton || !mobileMenu) return

    let isMenuOpen = false

    const setHamburgerState = (isOpen) => {
        if (hamburgerLines.length < 3) return

        hamburgerLines[0].style.transform = isOpen ? 'translateY(8px) rotate(45deg)' : ''
        hamburgerLines[1].style.opacity = isOpen ? '0' : ''
        hamburgerLines[2].style.transform = isOpen ? 'translateY(-8px) rotate(-45deg)' : ''
    }

    const setMenuState = (isOpen) => {
        mobileMenu.classList.toggle('hidden', !isOpen)
        mobileMenuBackdrop?.classList.toggle('hidden', !isOpen)
        mobileMenuButton.setAttribute('aria-expanded', String(isOpen))

        toggleClasses(topNav, ['bg-white', 'border-b', 'border-gray-200', 'shadow-sm'], !isOpen)
        toggleClasses(topNav, ['bg-transparent', 'border-transparent', 'shadow-none'], isOpen)
        mobileSignup?.classList.toggle('hidden', isOpen)
        setHamburgerState(isOpen)
    }

    const closeMenu = () => {
        if (!isMenuOpen) return

        isMenuOpen = false
        setMenuState(false)
        resetDrilldown()
    }

    mobileMenuBackdrop?.addEventListener('click', closeMenu)

    mobileMenuButton.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen
        setMenuState(isMenuOpen)

        if (!isMenuOpen) {
            resetDrilldown()
        }
    })
}

//Language selector with support for multiple flags per language and desktop hover behavior
function initializeLanguageSelector() {
    const languageSelector = document.getElementById('lang-selector')
    const languageButton = document.getElementById('lang-btn')
    const languageListbox = document.getElementById('lang-listbox')
    const languageChevron = document.getElementById('lang-chevron')
    const languageLabel = document.getElementById('lang-label')
    const languageFlags = document.getElementById('lang-flags')

    if (
        !languageSelector ||
        !languageButton ||
        !languageListbox ||
        !languageChevron ||
        !languageLabel ||
        !languageFlags
    ) {
        return
    }

    const languageOptions = queryAll('.lang-option', languageListbox)

    const createFlagImage = (src, alt) => {
        const image = document.createElement('img')
        image.src = src
        image.alt = alt
        image.className = 'h-7 w-7 rounded-full border-2 border-blue-700 object-cover'
        return image
    }

    const updateFlags = (option) => {
        const flags = [
            {
                src: option.getAttribute('data-flag-src'),
                alt: option.getAttribute('data-flag-alt') || '',
            },
            {
                src: option.getAttribute('data-flag-src-secondary'),
                alt: option.getAttribute('data-flag-alt-secondary') || '',
            },
        ].filter((flag) => flag.src)

        languageFlags.replaceChildren(...flags.map((flag) => createFlagImage(flag.src, flag.alt)))
    }

    const setSelectedLanguage = (option) => {
        const label = option.getAttribute('data-lang') || option.textContent?.trim() || ''

        languageLabel.textContent = label
        languageOptions.forEach((languageOption) => {
            languageOption.setAttribute('aria-selected', 'false')
        })

        option.setAttribute('aria-selected', 'true')
        updateFlags(option)
    }

    const openListbox = () => {
        languageListbox.classList.remove('hidden')
        languageButton.setAttribute('aria-expanded', 'true')
        languageChevron.style.transform = 'rotate(180deg)'
    }

    const closeListbox = () => {
        languageListbox.classList.add('hidden')
        languageButton.setAttribute('aria-expanded', 'false')
        languageChevron.style.transform = ''
    }

    const toggleListbox = () => {
        const isOpen = !languageListbox.classList.contains('hidden')

        if (isOpen) {
            closeListbox()
            return
        }

        openListbox()
    }

    const supportsHover = window.matchMedia('(hover: hover)').matches

    // Desktop users expect a hover flyout, while touch devices need a tap-to-toggle control.
    if (supportsHover) {
        languageSelector.addEventListener('mouseenter', openListbox)
        languageSelector.addEventListener('mouseleave', closeListbox)
    }

    languageButton.addEventListener('click', (event) => {
        event.stopPropagation()

        if (supportsHover) {
            openListbox()
            return
        }

        toggleListbox()
    })

    languageOptions.forEach((option) => {
        option.addEventListener('click', () => {
            setSelectedLanguage(option)
            closeListbox()
        })
    })

    const selectedOption =
        languageOptions.find((option) => option.getAttribute('aria-selected') === 'true') ||
        languageOptions[0]

    if (selectedOption) {
        setSelectedLanguage(selectedOption)
    }

    document.addEventListener('click', (event) => {
        if (languageSelector.contains(event.target)) return
        closeListbox()
    })
}

//Footer Accordions for mobile view

function initializeFooterAccordions() {
    const accordions = queryAll('.footer-accordion')

    accordions.forEach((accordion) => {
        const trigger = accordion.querySelector('.footer-acc-trigger')
        const panel = accordion.querySelector('.footer-acc-panel')
        const chevron = accordion.querySelector('.footer-acc-chevron')

        if (!trigger || !panel) return

        trigger.addEventListener('click', () => {
            const isOpen = !panel.classList.contains('hidden')

            accordions.forEach((item) => {
                item.querySelector('.footer-acc-panel')?.classList.add('hidden')

                const itemChevron = item.querySelector('.footer-acc-chevron')
                if (itemChevron) {
                    itemChevron.style.transform = ''
                }
            })

            if (isOpen) return

            panel.classList.remove('hidden')
            if (chevron) {
                chevron.style.transform = 'rotate(180deg)'
            }
        })
    })
}

//Interactive preview section for worry-free websites with preloaded images and smooth transitions

function initializeWorryFreeWebsites() {
    const worrySection = document.getElementById('worry-free-websites')
    if (!worrySection) return

    const worryButtons = queryAll('[data-worry-item]', worrySection)
    const previewMedia = document.getElementById('worry-preview-media')
    const previewImage = document.getElementById('worry-preview-image')
    const previewText = document.getElementById('worry-preview-text')

    if (!worryButtons.length || !previewMedia || !previewImage || !previewText) return

    worryButtons.forEach((button) => {
        const imageSource = button.getAttribute('data-image')
        if (!imageSource) return

        const image = new Image()
        image.src = imageSource
    })

    let activeButton =
        worryButtons.find((button) => button.classList.contains('is-active')) || worryButtons[0]
    let transitionTimeout = null

    const updateActiveButton = (targetButton) => {
        worryButtons.forEach((button) => {
            const isActive = button === targetButton
            button.classList.toggle('is-active', isActive)
            button.setAttribute('aria-pressed', isActive ? 'true' : 'false')
        })

        activeButton = targetButton
    }

    const syncPreviewContent = (targetButton) => {
        const nextImage = targetButton.getAttribute('data-image')
        const nextAlt = targetButton.getAttribute('data-alt') || ''
        const nextDescription = targetButton.getAttribute('data-description') || ''

        if (nextImage) {
            previewImage.src = nextImage
        }

        previewImage.alt = nextAlt
        previewText.textContent = nextDescription
    }

    const switchPreview = (targetButton) => {
        if (!targetButton || targetButton === activeButton) return

        const nextImage = targetButton.getAttribute('data-image')
        const nextDescription = targetButton.getAttribute('data-description') || ''

        if (!nextImage || !nextDescription) return

        updateActiveButton(targetButton)
        previewMedia.classList.add('is-out')
        previewText.classList.add('is-out')

        window.clearTimeout(transitionTimeout)
        transitionTimeout = window.setTimeout(() => {
            syncPreviewContent(targetButton)

            window.requestAnimationFrame(() => {
                previewMedia.classList.remove('is-out')
                previewText.classList.remove('is-out')
            })
        }, 180)
    }

    updateActiveButton(activeButton)
    syncPreviewContent(activeButton)

    worryButtons.forEach((button) => {
        button.addEventListener('click', () => {
            switchPreview(button)
        })
    })
}

//Carousel implementation And Animation

function initializePortfolioCarousel() {
    const portfolioCarousel = document.getElementById('portfolio-carousel')
    const track = document.getElementById('portfolio-track')

    if (!portfolioCarousel || !track) return

    const previousButton = document.getElementById('portfolio-prev')
    const nextButton = document.getElementById('portfolio-next')
    const paginationDots = queryAll('[data-portfolio-dot]')
    const totalItems = track.children.length

    if (!totalItems) return

    const MOBILE_BREAKPOINT = 768
    const DRAG_THRESHOLD = 50
    const TRACK_TRANSITION = 'transform 400ms cubic-bezier(0.25, 0.1, 0.25, 1)'
    const SLIDE_TRANSITION =
        'transform 200ms cubic-bezier(0.25, 0.1, 0.25, 1), opacity 200ms cubic-bezier(0.25, 0.1, 0.25, 1)'
    const activeSlideIndex = Math.min(1, totalItems - 1)
    const getVisibleWindow = () => (window.innerWidth < MOBILE_BREAKPOINT ? 1 : 3)
    const getSlides = () => queryAll('.portfolio-slide-item', track)
    const toPx = (value) => `${value.toFixed(3)}px`

    let visibleWindow = getVisibleWindow()
    let centeredWindowIndex = Math.floor(visibleWindow / 2)
    let itemWidth = 0
    let baseTrackOffset = 0
    let trackOffset = 0
    let isAnimating = false
    let isDragging = false
    let dragStartX = 0
    let dragCurrentX = 0
    let resizeTimeout

    const setTrackTransition = (value) => {
        track.style.transition = value
    }

    const setTrackTransform = (value) => {
        trackOffset = value
        track.style.transform = `translateX(${toPx(value)})`
    }

    const updatePagination = () => {
        if (!paginationDots.length) return

        const activeSlide = track.children[activeSlideIndex]
        const activeDotIndex = Number(activeSlide?.dataset.itemId ?? 0)

        paginationDots.forEach((dot, index) => {
            const isActive = index === activeDotIndex
            dot.classList.toggle('bg-[#004ced]', isActive)
            dot.classList.toggle('bg-gray-300', !isActive)
            dot.setAttribute('aria-current', isActive ? 'true' : 'false')
        })
    }

    const updateScaling = (centerIndex = activeSlideIndex, animate = true) => {
        getSlides().forEach((slide, index) => {
            slide.classList.add('transform')
            slide.style.transition = animate ? SLIDE_TRANSITION : 'none'
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
                return
            }

            slide.classList.add('scale-85', 'opacity-60', 'z-10')
        })
    }

    const measureCarousel = () => {
        const slides = getSlides()
        if (!slides.length) return

        const trackStyles = window.getComputedStyle(track)
        const gap = parseFloat(trackStyles.columnGap || trackStyles.gap || '0')

        itemWidth =
            visibleWindow === 1
                ? window.innerWidth
                : Math.round((slides[0].getBoundingClientRect().width + gap) * 1000) / 1000

        baseTrackOffset = -(activeSlideIndex - centeredWindowIndex) * itemWidth
        setTrackTransition('none')
        setTrackTransform(baseTrackOffset)
        updateScaling(activeSlideIndex, false)
        updatePagination()

        window.requestAnimationFrame(() => {
            setTrackTransition(TRACK_TRANSITION)
        })
    }

    const finishAnimation = () => {
        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
                setTrackTransition(TRACK_TRANSITION)
                isAnimating = false
            })
        })
    }

    const moveNext = () => {
        if (isAnimating || totalItems < 2 || itemWidth === 0) return

        isAnimating = true

        // Keep the active card in the same slot and rotate DOM nodes after each move.
        // That lets the carousel loop forever without a visible jump at either edge.
        updateScaling(Math.min(activeSlideIndex + 1, getSlides().length - 1))
        setTrackTransition(TRACK_TRANSITION)
        setTrackTransform(baseTrackOffset - itemWidth)

        const handleTransitionEnd = (event) => {
            if (event.target !== track || event.propertyName !== 'transform') return

            track.removeEventListener('transitionend', handleTransitionEnd)

            const firstSlide = track.firstElementChild
            if (firstSlide) {
                track.appendChild(firstSlide)
            }

            setTrackTransition('none')
            setTrackTransform(baseTrackOffset)
            updateScaling(activeSlideIndex, false)
            updatePagination()
            finishAnimation()
        }

        track.addEventListener('transitionend', handleTransitionEnd)
    }

    const movePrev = () => {
        if (isAnimating || totalItems < 2 || itemWidth === 0) return

        const lastSlide = track.lastElementChild
        if (!lastSlide) return

        isAnimating = true
        track.insertBefore(lastSlide, track.firstElementChild)
        setTrackTransition('none')
        setTrackTransform(baseTrackOffset - itemWidth)

        void track.offsetHeight

        updateScaling(Math.min(activeSlideIndex + 1, getSlides().length - 1))
        setTrackTransition(TRACK_TRANSITION)
        setTrackTransform(baseTrackOffset)

        const handleTransitionEnd = (event) => {
            if (event.target !== track || event.propertyName !== 'transform') return

            track.removeEventListener('transitionend', handleTransitionEnd)
            updateScaling(activeSlideIndex, false)
            updatePagination()
            isAnimating = false
        }

        track.addEventListener('transitionend', handleTransitionEnd)
    }

    const getPointerX = (event) => ('touches' in event ? event.touches[0].clientX : event.clientX)

    const handleDragStart = (event) => {
        if (isAnimating) return

        isDragging = true
        dragStartX = getPointerX(event)
        dragCurrentX = dragStartX
        setTrackTransition('none')
        track.style.cursor = 'grabbing'
    }

    const handleDragMove = (event) => {
        if (!isDragging) return

        dragCurrentX = getPointerX(event)
        const delta = dragCurrentX - dragStartX
        setTrackTransform(baseTrackOffset + delta)
    }

    const handleDragEnd = () => {
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
            return
        }

        setTrackTransition(TRACK_TRANSITION)
        setTrackTransform(baseTrackOffset)
    }

    previousButton?.addEventListener('click', (event) => {
        event.preventDefault()
        movePrev()
    })

    nextButton?.addEventListener('click', (event) => {
        event.preventDefault()
        moveNext()
    })

    portfolioCarousel.addEventListener('contextmenu', (event) => {
        event.preventDefault()
        moveNext()
    })

    portfolioCarousel.addEventListener('mousedown', handleDragStart)
    window.addEventListener('mousemove', handleDragMove)
    window.addEventListener('mouseup', handleDragEnd)

    portfolioCarousel.addEventListener('touchstart', handleDragStart, { passive: true })
    window.addEventListener('touchmove', handleDragMove, { passive: true })
    window.addEventListener('touchend', handleDragEnd)

    track.addEventListener('dragstart', (event) => {
        event.preventDefault()
    })

    window.addEventListener('resize', () => {
        window.clearTimeout(resizeTimeout)
        resizeTimeout = window.setTimeout(() => {
            if (isAnimating) return

            const nextVisibleWindow = getVisibleWindow()
            if (nextVisibleWindow !== visibleWindow) {
                visibleWindow = nextVisibleWindow
                centeredWindowIndex = Math.floor(visibleWindow / 2)
            }

            measureCarousel()
        }, 150)
    })

    measureCarousel()
}

document.addEventListener('DOMContentLoaded', () => {
    initializeNavigationDropdowns()

    const resetDrilldown = initializeMobileDrilldown()
    initializeMobileMenu(resetDrilldown)

    initializeLanguageSelector()
    initializeFooterAccordions()
    initializeWorryFreeWebsites()
    initializePortfolioCarousel()
})
