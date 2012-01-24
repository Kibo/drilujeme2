$(function(){    
    window.MemoryGameView = Backbone.View.extend({
        el: $("#practice-test-page"),
        
        isFinish: 0,
        
        isEmptyTemplate: _.template( $('#practice-isEmpty-template').html() ),
        memoryGameTemplate: _.template( $('#practice-memory-game-template').html() ),
        
        initialize: function(){                                            
            this.words = new WordList; 
            this.render();
        },
        
        render:function(){	
			
			if(this.isFinish ){
				//TODO                               
			
			}else if(this.words.length == 0){
                            this.$("#practice-test-view").html( this.isEmptyTemplate() );
			
			}else{
                            this.$("#practice-test-view").html( this.memoryGameTemplate() );				
			}
                        
			return this;
        }                       
    });
            
    window.memoryGame  = new MemoryGameView;	            
}); 


