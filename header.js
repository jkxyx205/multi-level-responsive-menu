;$(function () {
 'use strict';
  var threshold = 768; //移动端和PC端临界值

  var winMode; //当前窗口类型 pc | mobile

  var MODE_PC = 'pc', MODE_MOBILE = 'mobile'

 // 缓存jQuery对象
  var $header = $('header')
  var $firstItem = $('#menu-items .menu-nav-item:first-child')
  var $menuNavPrev = $('#menu-nav-prev')
  var $menuNavNext = $('#menu-nav-next')
  var $nav = $('#nav')
  var $searchBtnTrigger1 = $('#searchBtn-trigger-1')
 
  var $dropdownLi = $('header li.dropdown > a');
  var handleModeChanging = false

  function isMobileMode () {
    return document.documentElement.clientWidth <= threshold
  }

  function isPcMode () {
    return !isMobileMode()
  }

  function hasChangeMode() {
    return (isMobileMode() && winMode === MODE_PC)
            || (isPcMode() && winMode === MODE_MOBILE)
  }

  var search_value = "";

  var InitHandler = function () {

    this.pc = function() {
            console.log('init pc instance')
            var totalWidth = 0
            var menuFixedReigster = new MenuFixedReigster()
            var menuPageRegister = new MenuPageRegister()

             //计算总长度
            $('.menu-nav-item').each(function() {
                totalWidth += $(this).width()
            })



            function initEvent() {

                // 阻止事件被document捕获
                $('.search').on('click', function(e) {
                    e.stopPropagation()
                })

                // search1
                var $search = $('#searchInput-1')
                var $searchBtnTrigger1 =  $('#searchBtn-trigger-1')

                
                $searchBtnTrigger1.on('click', function(e) {
                    var value = $search.val()   
                    if ($(this).hasClass('open') && value) { //search
                        console.log('search by keywords: %s', value)
                    } else if (!$(this).hasClass('open')) { //open
                        $(this).addClass('open')
                        $(this).find('+ form > input').focus()
                    } else {
                        $(document).trigger('click')
                    }
                })



                $(document).on('click', function(e) {
                    //search btn-1
                    $searchBtnTrigger1.removeClass('open')
                   
                })

            }


            initEvent()

            function MenuFixedReigster () {
                    this.init = function () {
                        var offset = $nav.offset().top
                        var hasFixed = false

                        $(window).on('scroll', function() {
                            if ($(document).scrollTop() > offset && !hasFixed) {
                                $header.addClass("fixed")
                                hasFixed = !hasFixed
                            } else if ($(document).scrollTop() <= offset && hasFixed) {
                                $header.removeClass("fixed")
                                hasFixed = !hasFixed
                            }
                        }) 
                    }

                    this.unInit = function () {
                        $(window).off('scroll')
                    }
               }

               var _pc = this

               function MenuPageRegister () {
                    var pageWidth = 0
                    var maxOffset = 0

                    var minOffset = 0
                    var offsetCursor = 0
                    var resizeWaiting = false

                    this.init = function () {
                        $(window).on('resize', resize)
                        initPageInfo()
                        handleArrowIcon() 
                    }

                    this.unInit = function () {
                        $(window).off('resize', resize)
                        
                        offsetCursor = 0
                        $firstItem.css('margin-left', offsetCursor) //moveItem(offsetCursor) 
                        hideArrowIcon()
                    }

                    function resize () {
                        console.log("pc resize..")
                        if (hasChangeMode() && !handleModeChanging) {
                            return
                        }

                        if (resizeWaiting)
                            return



                        resizeWaiting = true

                        if (resizeTimer) clearTimeout(resizeTimer)

                        var resizeTimer = setTimeout(function() {

                            if (isMobileMode())
                                return

                            initPageInfo()

                            // if (totalWidth < pageWidth) {//一页显示得下
                            //     return
                            // }

                            // if (offsetCursor > minOffset) {
                            //     offsetCursor = minOffset
                            // } else if (offsetCursor < maxOffset) {
                            //     offsetCursor = maxOffset
                            // }

                            moveItem()
                            resizeWaiting = false

                        } , 500);

                    }

                    if (!modeCache[winMode]) {

                        $menuNavNext.on('click', function() {
                            offsetCursor = offsetCursor - pageWidth

                            // if (offsetCursor < maxOffset ) { //最后一页
                            //     offsetCursor = maxOffset
                            // } 

                            moveItem()
                        })

                        $menuNavPrev.on('click', function() {
                            offsetCursor = offsetCursor + pageWidth

                            // if (offsetCursor > minOffset ) { //第一页
                            //     offsetCursor = minOffset
                            // } 

                            moveItem()
                        })

                    }


                    function moveItem() {
                        if (maxOffset == 0)
                            return
                        
                        if (offsetCursor > minOffset) {
                            offsetCursor = minOffset
                        } else if (offsetCursor < maxOffset) {
                            offsetCursor = maxOffset
                        }

                        // if (totalWidth < pageWidth) {//一页显示得下
                        //     offsetCursor = minOffset
                        // }

                        $firstItem.css('margin-left', offsetCursor)
                        handleArrowIcon()
                    }

                    function initPageInfo () {
                         pageWidth = $('#menu-items').width() //一页的宽度
                         maxOffset = pageWidth - totalWidth
                         maxOffset = maxOffset < 0 ? maxOffset : 0

                         console.log("totalWidth: " + totalWidth)
                         console.log("pageWidth: " + pageWidth)
                         console.log("maxOffset: " + maxOffset)
                    }

                    function handleArrowIcon () {
                        if (offsetCursor > maxOffset) { //是否有下一页
                            $menuNavNext.addClass('show')
                        } else {
                            $menuNavNext.removeClass('show')
                        }

                        if (offsetCursor < minOffset) { //是否有上一页
                            $menuNavPrev.addClass('show')
                        } else {
                            $menuNavPrev.removeClass('show')
                        }
                    }

                    function hideArrowIcon () {
                        $menuNavNext.removeClass('show')
                        $menuNavPrev.removeClass('show')
                    }

               }


        this.init = function () {
            menuFixedReigster.init()
            menuPageRegister.init()
        }

        this.unInit = function () {
            menuFixedReigster.unInit()
            menuPageRegister.unInit()
        }

    }
    var mobileEventInit = false

    this.mobile = function() {
        console.log('init mobile instance')
        function initOnce() {

            $('#ham').on('click', function() {
                $('body').toggleClass('open')
            })

            $('#m-search').on('click', function() {
                $('#m-search-input').addClass("show")
            })

            $('#layout').on('click', function() {
                if (winMode === MODE_MOBILE) {
                    $('body').hasClass('open') && $('#ham').trigger('click')
                    $('#m-search-input').removeClass("show")
                }
            })

            $('#selectLangBtn, #langSelect').on('click', function () {
                $('#m-language-container').toggleClass('open')
            })

        }

        initOnce()

        this.init = function () {
            $dropdownLi.on('click', function (e) {
                $(this).parent().toggleClass('open')
                $(this).next().slideToggle()
            }) 
        }

        this.unInit = function () {
            $dropdownLi.removeClass('open')
            $('.mobile header .sub-menu').hide()
            $dropdownLi.off('click')
        }
    }

    var modeCache = {} // 缓存mode

    this.init = function () {
        initWinInfo()
        this.mode = modeCache[winMode] ? modeCache[winMode] : (modeCache[winMode] = new this[winMode]())
        this.mode.init()
        return this
    }

    this.unInit = function() {
        this.mode.unInit()
        return this
    }

  }

  function initWinInfo () {
    winMode = isMobileMode() ? MODE_MOBILE : MODE_PC
    $('body').removeClass().addClass(winMode)
  }


  var initHandler = new InitHandler()  
  initHandler.init()  

  $(window).on('resize', function() {

    if (hasChangeMode() && !handleModeChanging) {
        handleModeChanging = true
        initHandler.unInit().init()
    }
    handleModeChanging = false

  })

})