 $(function () {
            

            //----------------------------固定菜单栏--------------------------//
            
            

            var pageWidth = 0;

            var totalWidth = 0
            $('.menu-nav-item').each(function() {
                totalWidth += $(this).width()
            })
     
            var maxOffset = 0
            var minOffset = 0
            var offsetCursor = 0

            $(window).on('resize', function() {

                initData()
                initItem() 

                if (offsetCursor >= minOffset) {
                    offsetCursor = minOffset
                } else if (offsetCursor <= maxOffset) {
                    offsetCursor = maxOffset
                }

                console.log("offset: %f", offsetCursor)
                offsetItem(offsetCursor)
            })

            $menuNavNext.on('click', function() {
                    offsetCursor = offsetCursor - pageWidth

                    if (offsetCursor < maxOffset ) { //最后一页
                        offsetCursor = maxOffset
                    } 
                    offsetItem(offsetCursor)
               
            })

            $menuNavPrev.on('click', function() {
                    offsetCursor = offsetCursor + pageWidth

                    if (offsetCursor > minOffset ) { //第一页
                        offsetCursor = minOffset
                    } 

                    offsetItem(offsetCursor)
            })

            function offsetItem(offsetCursor) {
                $firstItem.css('margin-left', offsetCursor)
                initItem()
            }

            function initData() {
                 pageWidth = $('#menu-items').width() //一页的宽度
                 maxOffset = pageWidth - totalWidth
            }

            function initItem() {
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

        })

        

        //----------------------------mobile语言切换--------------------------//
        $('#selectLangBtn, #langSelect').on('click', function () {
            $('#m-language-container').toggleClass('open')
        })