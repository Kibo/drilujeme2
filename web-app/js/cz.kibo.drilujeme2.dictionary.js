$(function(){ 

window.ImagesView = Backbone.View.extend({ 
					
		imagesTemplate: _.template( $('#dictionary-images-template').html()  ),
		
		events:	{
			"click #dictionary-images-result div img": "showImage"					
		},
		
		showImage: function( event ){ 			
			this.model.set({image: $(event.target).attr('src') });			
			$("#dictionary-preview-img").attr('src', this.model.get('image')  );    			
		},
		
		render:function(){		
			$('#dictionary-preview-img').attr('src', this.model.get("image") );
			$(this.el).html( this.imagesTemplate( {images: this.model.get("images") } ) );					
		    return this;		
		}	
});	
		
window.WordsView = Backbone.View.extend({ 
		
	wordsTemplate: _.template( $('#dictionary-words-template').html()  ),
	errorTemplate: _.template( $('#dictionary-words-error-template').html()  ),
	
	events:	{		
		"click .voice-button":              "playSound",
		"click #dictionary-save-button":    "saveModel"			
	},
	
	playSound:function(){
		this.model.playSound();	
	},
	
	saveModel:function(){
		this.setItems();					
		if (  this.model.saveModel() ){
                    this.remove();
                    $("#dictionary-translate-input").focus();
		}				
	},
	
	setItems:function(){   
            var input = $('#dictionary-items-input');           
            if (input.val() == '' || input.val() == input.attr('placeholder')){
                //TODO warning message
                this.$("#dictionary-warning-message").show();
            }else{
                this.model.set({ items: $('#dictionary-items-input').val() }); 
            }                                  		        
        },
		
	render:function(){				               
            if( this.model.get('status') == 'ok' ){	                                                            
                    $(this.el).html( this.wordsTemplate( this.model.toJSON() ) );   						
            }else{			
                    $(this.el).html( this.errorTemplate( this.model.toJSON() ) );		
            }     				  				
	    return this;														
	}	
});
		
window.AppView = Backbone.View.extend({
		
		el: $("#dictionary-page"),
					
		resultTemplate: _.template( $('#dictionary-result-template').html() ),
				
		initialize: function(){
                    this.input = this.$("#dictionary-translate-input");    				
		},
		
		events:	{
                    "keypress #dictionary-translate-input":	"translateOnEnter",
                    "click #dictionary-translate-button":	"translate"					
		},
			 			    
		translateOnEnter: function( event ){                       
			if( event.which != 13 ) return;
			this.translate( event );					
		},
		
		translate: function( event ){                      
			event.preventDefault();
			var val = this.input.val();
			if (val == '' || val == this.input.attr('placeholder')) return; 
							
			this.render();			
			new Word( { term: this.input.val().trim() } ).translate();
			this.input.val('');                       
		},
												 		    			    
		render: function(){         				    						
                    this.$("#dictionary-translate-result").html( this.resultTemplate() );  
		    return this;							
		}
	}); 
	     
	window.app  = new AppView;      
});         
