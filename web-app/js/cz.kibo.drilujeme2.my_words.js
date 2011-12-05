$(function(){ 

window.VocabularyView = Backbone.View.extend({
        	
        	el: $("#my_words-page"),
        	
        	vocabularyTemplate: _.template( $('#my_words-list-template').html() ),
        	noResultFoundTemplate: _.template( $('#my_words-list-noresult-template').html() ),
        	
        	initialize: function(){        		       
        		this.localStorage = new Preference().dictionary;        		
        		this.words =  this.getAllWords();             		
        		this.render();
        	},
        	
        	events:{
        		"change .vocabulary-gravity-input": "updateWord",
        		"click .vocabulary-delete-link": "deleteWord"        		        			        
        	},
        	
        	deleteWord:function( event ){                  
        		var id = $(event.target).attr('data-model');        		        	
        		this.localStorage.destroy(  {id: id} );        		
        		this.words =  this.getAllWords();
        		this.render();        		        	        
        	},
        	
        	updateWord:function( event ){ 
        		var target = $(event.target);
        		var gravity = parseInt ( target.val() );        		        		        
        		var id = target.attr('data-model');         		                                                                    
                        var model = new Word(this.localStorage.find( { 'id':id } ));                        
                        model.set( {'gravity': gravity } );                                                
                        this.localStorage.update( model );                      
        	},
        	        	
        	getAllWords:function(){
        		var allVocabulary = this.localStorage.findAll();        		        	
        		var sortedVocabulary = _.sortBy( allVocabulary, function(obj){ return obj.gravity; });
	    		sortedVocabulary.reverse();	
	    		return sortedVocabulary;        		
        	},
        	        	        	        	        	        	                	        	        			    	    		   
        	render:function(){             		
        		if( _.isEmpty( this.words ) ){
        			this.$("#my_words-list-result").html( this.noResultFoundTemplate( ) );    						
    			}else{
    				this.$("#my_words-list-result").html( this.vocabularyTemplate(  { words: this.words } ) );
    			}     				  				    		           		        		        		    			    			    				
    		    return this;  		
        	}        	        	    	    
});

window.vocabulary  = new VocabularyView;		        

});  