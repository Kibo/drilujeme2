window.Word = Backbone.Model.extend({
		
		defaults: function(){			
			function getDate(){
				var today = new Date();						
				return new Date(today.getFullYear(), today.getMonth(), today.getDate() ).getTime();
			}
								
			return{
                            "gravity":	10,	
			    "published": getDate()		    
			};			
		},	
		
		initialize: function(){
			this.preference = new Preference();
			this.localStorage = this.preference.dictionary;									
		},
		
		player: new Audio(),
		
		playSound: function(){                        
                    if ( !document.createElement('audio').canPlayType('audio/mpeg') ){
                        
                        if ( $('#audioPlayer')){
                            $('body').append('<div id="audioPlayer"></div>');
                        }
                        
                        $('#audioPlayer').html('<object type="application/x-shockwave-flash" data="swf/player_mp3_mini.swf" width="0" height="0"><param name="movie" value="swf/player_mp3_mini.swf" /><param name="FlashVars" value="mp3=' + this.get('sound') + '&autoplay=1" /></object>');                                                                                                        
                    }else{
                        this.player.setAttribute("src", this.get('sound') );    				
			this.player.play(); 
                    }                    			
		},
						    			   
		translate: function(){	                    
                    var instance = this;                   
                    $.ajax({
                        type: "GET",
                        dataType: "json",
                        url: 'translate/' + instance.get('term'),
                        async: true,	         
                        success: function(data) {

                            if(data['status'] == 'ok'){
                                    instance.set( data );                                   
                                    instance.getImages();
                            }
                            instance.showWords();
                        }    				    	    				
                    }); 								    				    				    				  
		},
		
		getImages:function(){
                    var instance = this;
                    $.ajax({
                        type: "GET",
                        dataType: "json",
                        url: 'photos/' + instance.get('term'),
                        async: true,
                        success: function(data) {    

                            var images = [];
                            $.each(data.photos.photo, function(i,item){
                                    var src = 'http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_m.jpg';
                                images.push( src );
                            });
                            instance.set( {"images": images, "image": images[0] });
                            instance.showImages();              		           
                        }    				    	    				
                    });			
		},
                
                showWords:function(){						
			var wordsView = new WordsView( { model: this, el: $("#dictionary-words-result")} );
			wordsView.render();		
		},
					
		showImages:function(){
			var imagesView = new ImagesView( { model: this, el: $("#dictionary-images-result") } );
			imagesView.render();	
		},
		
		saveModel:function(){							
			var success = false;
			if (this.get('term')  &&				
                            this.get('items') &&
                            this.get('image') &&
                            this.get('sound') && 
                            this.get('gravity')){  											
					new Word({id: this.get('term'), term: this.get('term'), items: this.get('items'), image: this.get('image'), sound: this.get('sound'), gravity: this.get('gravity')}).save();				
					success = true;				   					    			
			}
			
			return success;
		}
});