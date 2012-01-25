$(function(){				
    window.Practice = Backbone.View.extend({
    	el: $("#practice-page"),
    	    	    	    
    	initialize: function(){
    		this.preference = new Preference();  
    		this.render();
                this.$(".practice-test-type-radio[value='" + this.preference.get('teacher') + "']").attr('checked', 'checked');
                this.$('.tag:has( input:checked )').addClass("tagged");
    	},
    	
    	events:{    		
    		"change #practice-numberOfWords": "updatePreference",               
    		"click #practice-start-button": "start"	,
                "click .tag": "changeRadio"
    	},
        
        changeRadio:function( event ){
            var tag = event.currentTarget;
            $(tag).find(".practice-test-type-radio").attr("checked", "checked");   
            this.updatePreference();
            
            $(".tag").removeClass("tagged");
            $(tag).addClass("tagged");
        },
        
    	start:function(){    	
    		window.location.replace('practice_' +  this.$(".practice-test-type-radio:checked").val()  + '.html')    	
    	},
    	
    	updatePreference:function(){
    		this.preference.set({ "numberOfWords":  parseInt(this.$('#practice-numberOfWords').val()), "teacher": this.$(".practice-test-type-radio:checked").val() });    		
    	},
    	        	    	        
    	render:function(){
            this.$('#practice-numberOfWords').val(  this.preference.get('numberOfWords') );    	
            return this;  		
    	}    	    	      
    });
    
    window.practice  = new Practice;		    
}); 

