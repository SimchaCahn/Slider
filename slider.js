function simSlider(parentElem, config) {
    /* ----------------------------------- */
    /* -------- Variable Creation -------- */
    /* ----------------------------------- */
    var currentThis = this,
        personalID = parentElem.id,
        outerWrapper = document.createElement('div'),
        innerWrapper = document.createElement('div'),
        labelWrapper = document.createElement('div'),
        tabUnderliner = document.createElement('div'),
        extraContent = document.createElement('div'),
        content = parentElem.children,
        contentsHeight = [],
        contentWidth = parentElem.offsetWidth,
        mouseEnterMenuIndex,
        proceedToChangeTab = true,
        selectedIndex = 0,
        prevIndex = 0;


    /* ---------------------------------- */
    /* ------- Configure Settings ------- */
    /* ---------------------------------- */
    if (config === undefined) config = {};
    currentThis.config = {
        // Class Names
        outerWrapperClassName: config.outerWrapperClassName,
        innerWrapperClassName: config.innerWrapperClassName,
        labelWrapperClassName: config.labelWrapperClassName,
        labelsClassName: config.labelsClassName,
        tabUnderlinerClassName: config.tabUnderlinerClassName,

        // CSS Styles
        background: config.background || 'hsla(43, 74%, 88%, 1)',
        bottomPadding: config.bottomPadding || 20,
        // Menu Style
        menuVerticalPadding: config.menuVerticalPadding || 13,
        menuColor: config.menuColor || 'hsla(43, 77%, 65%, 1)',
        menuColorHover: config.menuColorHover || 'hsla(43, 78%, 71%, 1)',
        menuColorActive: config.menuColorActive || 'hsla(43, 78%, 77%, 1)',
        menuTextColor: config.menuTextColor || 'hsl(43, 100%, 18%)',
        tabUnderlinerColor: config.tabUnderlinerColor || 'hsla(43, 78%, 45%, 1)',
        tabTitles: config.tabTitles,
        // Other Style
        animation: config.animation || '0.7s cubic-bezier(0.45, 0.05, 0.55, 0.95)',

        // Other
        tabIndex: (config.tabIndex && config.tabIndex < content.length) ? config.tabIndex : content.length,

        // Callbacks
        beforeInit: config.beforeInit || emptyFunction,
        endInit: config.endInit || emptyFunction,

        beforeSlide: config.beforeSlide || emptyFunction,
        slide: config.slide || emptyFunction,
        endSlide: config.endSlide || emptyFunction
    };

    function emptyFunction() {}


    /* ------------------------------------------ */
    /* ----- Handle Slider Change/Animation ----- */
    /* ------------------------------------------ */
    function mouseEnterMenu(e) {
        mouseEnterMenuIndex = Array.prototype.indexOf.call(labelWrapper.children, e.target);
        if (e.target.tagName !== 'LABEL' || mouseEnterMenuIndex === selectedIndex) {
            mouseEnterMenuIndex = null;
            return;
        }

        labelWrapper.children[mouseEnterMenuIndex].style.background = currentThis.config.menuColorHover;
    }

    function mouseLeaveMenu(e) {
        if (mouseEnterMenuIndex === null) return;

        labelWrapper.children[mouseEnterMenuIndex].style.background = currentThis.config.menuColor;
        mouseEnterMenuIndex = null;
    }



    function changeFunction(e) {
        mouseEnterMenuIndex = null;
        var tempSelectedIndex = Array.prototype.indexOf.call(labelWrapper.children, e.target);
        if (e.target.tagName !== 'LABEL' || !proceedToChangeTab || tempSelectedIndex === selectedIndex) return;
        proceedToChangeTab = false;

        // See: http://stackoverflow.com/a/36364780/4861207
        content = innerWrapper.children
        selectedIndex = tempSelectedIndex;

        currentThis.config.beforeSlide(selectedIndex, content[selectedIndex]);
        var amount = '-' + contentWidth + 'px';

        content[selectedIndex].style.width = contentWidth + 'px';

        if (selectedIndex < prevIndex) {
            innerWrapper.style.transform = 'translateX(' + amount + ')';
            amount = '0';
        }

        setTimeout(function() {
            innerWrapper.style.transition = 'transform ' + currentThis.config.animation;
            innerWrapper.style.transform = 'translateX(' + amount + ')';
            outerWrapper.style.height = (contentsHeight[selectedIndex] + currentThis.config.bottomPadding) + 'px';
            tabUnderliner.style.transform = 'translateX(' + (selectedIndex * 100) + '%)';

            labelWrapper.children[selectedIndex].style.background = currentThis.config.menuColorActive;
            labelWrapper.children[prevIndex].style.background = currentThis.config.menuColor;

            currentThis.config.slide(selectedIndex, content[selectedIndex]);
        });
    }

    function transitionCallback(e) {
        // See: http://stackoverflow.com/q/36274519/4861207
        if (e.target !== innerWrapper) return;

        innerWrapper.style.transition = 'none';
        innerWrapper.style.transform = 'translateX(0)';
        content[prevIndex].style.width = 0;

        prevIndex = selectedIndex;
        currentThis.config.endSlide(selectedIndex, content[selectedIndex]);
        proceedToChangeTab = true;
    }


    /* ---------------------------------- */
    /* ------ Initialize simSlider ------ */
    /* ---------------------------------- */
    function initSimSlider() {
        // beforeInit Callback
        currentThis.config.beforeInit;

        // Move contents (slides) to 'innerWrapper'
        while (content.length) {
            if (content.length > currentThis.config.tabIndex) {
                extraContent.appendChild(content[content.length - 1]);
            } else {
                content[0].style.width = 0;
                content[0].style.overflow = 'hidden';
                contentsHeight.push(content[0].offsetHeight);
                innerWrapper.appendChild(content[0]);
            }
        }
        content = innerWrapper.children;

        // Create and Style Tabs
        for (var i = 0; i < currentThis.config.tabIndex; i++) {
            var label = document.createElement('label');

            // Apply Settings
            label.innerHTML = currentThis.config.tabTitles ? currentThis.config.tabTitles[i] : i;
            label.style.width = 100 / currentThis.config.tabIndex + '%';
            label.style.padding = currentThis.config.menuVerticalPadding + 'px 0';
            label.style.background = currentThis.config.menuColor;
            label.style.color = currentThis.config.menuTextColor;

            label.className = 'simSliderMenuLabel';
            if (currentThis.config.labelsClassName) label.className += ' ' + currentThis.config.labelsClassName;

            labelWrapper.appendChild(label);
        }

        // Add eventListener
        labelWrapper.addEventListener('mouseover', mouseEnterMenu);
        labelWrapper.addEventListener('mouseout', mouseLeaveMenu);
        labelWrapper.addEventListener('click', changeFunction);
        if ('transition' in document.documentElement.style) innerWrapper.addEventListener('transitionend', transitionCallback);

        // Add CSS Style
        parentElem.style.position = 'relative';
        labelWrapper.children[selectedIndex].style.background = currentThis.config.menuColorActive;
        content[selectedIndex].style.width = contentWidth + 'px';
        tabUnderliner.style.transition = 'transform ' + currentThis.config.animation;
        labelWrapper.className = 'simSliderLabelWrapper';

        // outerWrapper
        outerWrapper.className = 'simSliderOuterWrapper';

        outerWrapper.style.width = contentWidth + 'px';
        outerWrapper.style.height = (contentsHeight[selectedIndex] + currentThis.config.bottomPadding) + 'px';
        outerWrapper.style.transition = 'height ' + currentThis.config.animation;
        outerWrapper.style.background = currentThis.config.background;

        // innerWrapper
        innerWrapper.className = 'simSliderInnerWrapper';
        innerWrapper.style.width = (contentWidth * 2) + 'px';

        // tabUnderliner
        tabUnderliner.className = 'simSliderTabUnderliner';
        tabUnderliner.style.background = currentThis.config.tabUnderlinerColor;
        tabUnderliner.style.width = 100 / currentThis.config.tabIndex + '%';

        // Add Class Names
        if (currentThis.config.outerWrapperClassName) outerWrapper.className += ' ' + currentThis.config.outerWrapperClassName;
        if (currentThis.config.innerWrapperClassName) innerWrapper.className += ' ' + currentThis.config.innerWrapperClassName;
        if (currentThis.config.labelWrapperClassName) labelWrapper.className += ' ' + currentThis.config.labelWrapperClassName;
        if (currentThis.config.tabUnderlinerClassName) tabUnderliner.className += ' ' + currentThis.config.tabUnderlinerClassName;

        // Append Elements
        parentElem.appendChild(tabUnderliner);
        parentElem.appendChild(labelWrapper);
        outerWrapper.appendChild(innerWrapper);
        parentElem.appendChild(outerWrapper);
        parentElem.appendChild(extraContent);

        // endInit Callback
        currentThis.config.endInit;
    }

    /* ---------------------------------- */
    /* -------- Inital Rendering -------- */
    /* ---------------------------------- */
    initSimSlider();
}

/*var mySlider = document.getElementById('mySlider'),
    slider = new simSlider(mySlider);*/
