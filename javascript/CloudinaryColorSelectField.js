/**
 * Created by priyashantha on 6/30/14.
 */
if (typeof MadeUtils === 'undefined') { var MadeUtils = {};}


(function($) {
    $.entwine('ss', function($){

        MadeUtils.ColorSelect = {
            LoadColorSelectTiles : function(dom){
                var holder = $(dom);
                var div = holder.find('.ColourSelectField-holder');
                var name = div.data('field');
                holder.data('imageurl', $('#'+name).find('.ss-uploadfield-item:first-child').data('imageurl'));

                var imageURL = div.data('url') + '?current_image=' + holder.data('imageurl');
                var input = holder.find('input.cloudinarycolorselect');
                var selectedColor = holder.find('.colours li.colour-picker').length ? MadeUtils.ColorSelect.hexToRGB(input.val()) : input.val();
                if(imageURL){
                    var img = $('<img src="' + imageURL + '">');
                    holder.find('.imageHolder').html(img);
                    if(!holder.data('imageurl')){
                        holder.find('.imageHolder').html('');
                        holder.find('.colours').html('Please attach an image to pick a colour');
                    }

                    img.on('load', function(){
                        if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0){
                            holder.find('.imageHolder').html('');
                            holder.find('.colours').html('File not found, or not accessible');
                            return;
                        }

                        var colorThief = new ColorThief();
                        var color = colorThief.getColor(img[0]);
                        var palette = colorThief.getPalette(img[0], 20);

                        var strHTML = '';
                        var colorString = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
                        var className = 'colour-select';
                        if(colorString == selectedColor)
                            className += ' selected';


                        strHTML += '<li style="background: ' + colorString + '" data-value="' + colorString+ '" class="'+ className +'"></li>';
                        for(key in palette){
                            color = palette[key];
                            colorString = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';

                            className = 'colour-select';
                            if(colorString == selectedColor)
                                className += ' selected';

                            strHTML += '<li style="background: ' + colorString + '" data-value="' + colorString+ '" class="'+ className +'"></li>';
                        }

                        holder.find('.colours li.loading-text').replaceWith(strHTML);
                        holder.find('.colours li.colour-picker').show();
                    });
                }
            },

            PerformSelectColor: function(dom){

                var holder = $(dom).closest('.ColourSelectField-holder');
                var input = holder.find('input.cloudinarycolorselect');
                var rgb = $(dom).data('value');
                var value = holder.find('.colours li.colour-picker').length ? '#'+MadeUtils.ColorSelect.RGBToHex(rgb) : rgb;
                input.val(value);
                holder.find('.colour-select').removeClass('selected');
                $(dom).addClass('selected');
                $('.minicolors-swatch-color').css({
                    'background-color' : rgb
                });
                return false;
            },

            UpdateColorSelectWithSelection: function(dom){
                $(dom).find('.colours li.loading-text').replaceWith('<li class="loading-text">Loading....</li>');
                this.LoadColorSelectTiles(dom);
            },

            UpdateColorSelectWithSelectionForCloudinary: function(imageFieldName){
                var inputs = $('.ColourSelectField-holder[data-field="' + imageFieldName + '"]')
                if(inputs.length){
                    this.UpdateColorSelectWithSelection(inputs.parent().parent());
                }
            },

            RGBToHex: function(rgb){
                var arrRGB = rgb.replace(/[^\d,]/g, '').split(',');
                var bin = arrRGB[0] << 16 | arrRGB[1] << 8 | arrRGB[2];
                return (function(h){
                    return new Array(7-h.length).join("0")+h
                })(bin.toString(16))
            },

            hexToRGB: function(hex){
                hex = parseInt(hex.replace('#', '') ,16)
                var r = hex >> 16;
                var g = hex >> 8 & 0xFF;
                var b = hex & 0xFF;
                return 'rgb('+r+','+g+','+b+')';
            }

        }

        $(".field.cloudinarycolorselect").entwine({
            onmatch: function() {
                MadeUtils.ColorSelect.UpdateColorSelectWithSelection(this);
            }
        });

        $("li.colour-select").entwine({
            onclick: function(){
                MadeUtils.ColorSelect.PerformSelectColor(this);
            }
        });

        $("input.colourpickerinput").entwine({
            onchange: function(){
                var rgb = MadeUtils.ColorSelect.hexToRGB($(this).val());
                $(this).val('#'+MadeUtils.ColorSelect.RGBToHex(rgb));
                $(this).parent().parent().data('value', rgb);
            },
            onclick: function() {
                $(this).parent().parent().css({
                    'width' : '175px',
                    'height': '180px'
                });
            },
            onfocusout: function() {
                $(this).parent().parent().removeAttr('style');
            }
        });

    });
})(jQuery);



