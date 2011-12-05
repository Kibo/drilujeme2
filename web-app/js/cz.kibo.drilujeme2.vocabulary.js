$(function(){ 

window.VocabularyView = Backbone.View.extend({
        	
        	el: $("#vocabulary-page"),
        	
        	vocabularyTemplate: _.template( $('#vocabulary-template').html() ),
        	noResultFoundTemplate: _.template( $('#vocabulary-noResultFound-template').html() ),
        	
        	initialize: function(){
        		this.preference = new Preference();
        		this.localStorage = new Store(  this.preference.getDictionaryName() );
        		this.words =  this.getAllWords();
        	        		        		        		       
        		this.render();
        	},
        	
        	events:{
        		"change .vocabulary-gravity-input": "updateWord",
        		"click .vocabulary-delete-link": "deleteWord"        		        			        
        	},
        	
        	deleteWord:function(){
        		var id = $(event.target).attr('data-model');        		        	
        		this.localStorage.destroy(  {id: id} );        		
        		this.words =  this.getAllWords();
        		this.render();        		        	        
        	},
        	
        	updateWord:function( event ){ 
        		var target = $(event.target);
        		var gravity = parseInt ( target.val() );        		        		        
        		var index = target.attr('data-idx'); 
        		        	
        		var word = this.words[ index ];         		        		        
        		new Word({id: word.term + '.' + word.lang, term: word.term, lang: word.lang, items: word.items, image: word.image, sound: word.sound, gravity: gravity, category: word.category }).save();    			    			       
        	},
        	        	
        	getAllWords:function(){
        		var allVocabulary = this.localStorage.findAll();
        		var sortedVocabulary = _.sortBy( allVocabulary, function(obj){ return obj.gravity; });
	    		sortedVocabulary.reverse();	
	    		return sortedVocabulary;        		
        	},
        	        	        	        	        	        	                	        	        			    	    		   
        	render:function(){     
        		
        		if( _.isEmpty( this.words ) ){
        			this.$("#vocabulary-basic-view").html( this.noResultFoundTemplate( ) );    						
    			}else{
    				this.$("#vocabulary-basic-view").html( this.vocabularyTemplate(  { words: this.words } ) );
    			}     				  				    		           		        		        		    			    			    				
    		    return this;  		
        	}        	        	    	    
});

window.vocabulary  = new VocabularyView;		        

});  