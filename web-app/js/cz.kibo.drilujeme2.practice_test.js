window.Graph = Backbone.Model.extend({
    
    defaults: function(){			
			function getDate(){
				var today = new Date();						
				return new Date(today.getFullYear(), today.getMonth(), today.getDate() ).getTime();
			}
								
			return{
                            "id": getDate(),
                            "words":	0,
                            "mistakes":	0			    		    
			};			
    },
    
    MAX_ITEM:   10,
    MONTH_NAMES: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
    KARMA_IMAGES: [ "Zombie", "Troll", "Baby", "Student", "Teacher", "Superhero", "Robot"],
    KARMA_TEXTS: [ "You're a thing without a brain.", "You are stupid monstrum.", "Everything is just in front of you.", "Be patient and persistent.", "Share your knowledge with others.", "Take the rich and give the poor.", "You can not be human."],
            
    initialize: function(){		
         this.preference = new Preference();
         this.localStorage = new Store( "cz.kibo.drilujeme2.graph" );
         this.publishedMap = this.published();
         this.activities = this.localStorage.findAll();            
    },
    
    savePracticeResult:function(){
        var itm = this.localStorage.find( {id:this.get('id')} );
        if( itm ){
            this.set({'words': itm.words + this.get('words'), 'mistakes': itm.mistakes + this.get('mistakes') });
            
        }else{
            this.set({'words': this.get('words'), 'mistakes': this.get('mistakes') });          
        }
        
        this.save();
        this.activities = this.localStorage.findAll();
    },
    
    computeSuccess:function(){
        this.success = Math.round( (this.get('words') - this.get('mistakes')) == 0 ? 0 : (this.get('words') - this.get('mistakes')) / ( this.get('words')/ 100 ) );
    },
         
    published:function(){        
        var publishedMap = {};
        var monthNames = this.MONTH_NAMES;
                        
        var publishedArray = _.pluck(this.preference.dictionary.findAll(), 'published');       
        var publishedArrayUniq = _.uniq( publishedArray );       
        var publishedArraySelected = publishedArrayUniq.sort().reverse().slice(0, this.MAX_ITEM  ).reverse();
                                        
        _.each( publishedArraySelected , function(publishedDate){            
           var size = _.filter( publishedArray , function( pDate ){return pDate == publishedDate;}).length;                                 
           var date = new Date( publishedDate );                                
           publishedMap[  monthNames[ date.getMonth()]  + " " + date.getDate()  ] = size                      
        });
                                       
        return publishedMap ;                  
    },
    
    publishedDays:function(){
        return _.keys( this.publishedMap ).join('|');
    },
        
    publishedWords:function(){                
        return _.values( this.publishedMap ).join(',');
    },
    
    publishedMaxOfWords:function(){
        return _.max( this.publishedMap , function(pub){return pub;});
    },
    
    activitiesDays:function(){               
        var monthNames = this.MONTH_NAMES;        
        var days = _.pluck(this.activities, 'id'); 
        var daysSort = days.sort().reverse().slice(0, this.MAX_ITEM  ).reverse();
        
        var daysNamed = []
        _.each( daysSort , function( day ){                                                     
           var date = new Date( day );                                
           daysNamed.push( monthNames[ date.getMonth()]  + " " + date.getDate() );                   
        });
               
        return daysNamed.join('|');
    },
    
    activitiesWords:function(){
        var words = _.pluck(this.activities, 'words');               
        var wordsSort = words.reverse().slice(0, this.MAX_ITEM  ).reverse();                
        return wordsSort.join(',');
    },
    
    activitiesMistakes:function(){
        var mistakes = _.pluck(this.activities, 'mistakes');               
        var mistakesSort = mistakes.reverse().slice(0, this.MAX_ITEM  ).reverse();               
        return mistakesSort.join(',');
    },
    
    activitiesMaxOfWords:function(){
        var activity =  _.max( this.activities , function( activity ){return activity.words;});
        return activity.words;
    },
    
    computeKarma:function(){
                
        var level = 0;
        
        //robot
        if( this.success == 100 ) level =  6;
        
        //superhero
        if( this.success < 100 ) level =  5; 
        
        //teacher
        if( this.success < 95 ) level =  4; 
        
        //kid
        if( this.success < 90 ) level =  3;
        
         //baby
        if( this.success < 85 ) level =  2; 
                           
        //troll
        if( this.success < 80 ) level =  1;
        
        //zombie
        if( this.success < 70 ) level =  0;
                                                                                                                                   
        this.karmaTitle = this.KARMA_IMAGES[level];
        this.karmaText = this.KARMA_TEXTS[level]; 
    }  
});

var CZ_KIBO_DRILUJEME2_TEMPLATES = {
        TEXT:' \
                <div class="box"> \
                    <table class="zebra-striped"> \
                        <thead> \
                                <tr> \
                                        <th>Image</th> \
                                        <th>Word</th> \
                                        <th>Voice</th> \
                                        <th>Translation</th> \
                                        <th>Action</th> \
                                </tr> \
                        </thead> \
                         <tbody> \
                            <tr> \
                                <td><img src="<%= word.image%>" alt="preview" /></td> \
                                <td><h3 id="practice-text-term"><span><%= word.items %></span></h3></td> \
                                <td><img class="voice-button" data-model="<%= word.term %>" src="images/voice.png" alt="voice" /></td> \
                                <td> \
                                    <div class="input"> \
                                        <input class="large" id="practice-text-input" size="20" type="search" name="practice-text-input" value="" autocomplete="off" autofocus="autofocus" placeholder="Write word." maxlength="30" /> \
                                    </div> \
                                </td> \
                                <td><button id="practice-text-check-button" class="btn primary">Check</button></td> \
                            </tr> \
                        </tbody> \
                    </table> \
                </div> \
            ',
            
        RADIO:'\
                <div class="box"> \
		<table class="zebra-striped"> \
                    <thead> \
                        <tr> \
                            <th>Image</th> \
                            <th>Word</th> \
                            <th>Voice</th> \
                            <th>Translation</th> \
                            <th>Action</th> \
                        </tr> \
                    </thead> \
                    <tbody> \
                        <tr> \
                            <td><img src="<%= word.image %>" alt="preview" /></td> \
                            <td><h3 id="practice-text-term"><span>?</span></h3></td> \
                            <td><img class="voice-button" data-model="<%= word.term %>" src="images/voice.png" alt="voice" /></td> \
                            <td> \
                                <ol id="practice-words-preview" class="inputs-list"> \
                                    <% _.each(alternative, function(items, idx) { %> \
                                        <li> \
                                            <label> \
                                                <input type="radio" name="practice-radio-option" value="<%= items %>" /> \
                                                <span><%= items %></span> \
                                            </label> \
                                        </li> \
                                    <% }); %> \
                                </ol> \
                            </td> \
                            <td><button id="practice-text-check-button" class="btn primary">Check</button></td> \
                        </tr> \
                    </tbody> \
		</table> \
            </div> \
        ',
        
        FINISH: ' \
                <div class="row"> \
                    <div class="span8" > \
                        <div class="box"> \
                            <h3>Today\'s karma</h3> \
                            <div class="popoverWrapper"> \
                                <img src="images/karma/<%= graphs.karmaTitle %>.png" alt="<%= graphs.karmaTitle %>" width="128" height="128" > \
                                <div class="popover right"> \
                                        <div class="arrow"></div> \
                                        <div class="inner"> \
                                              <h3 class="title"><%= graphs.karmaTitle %></h3> \
                                              <div class="content"> \
                                                    <p><%= graphs.karmaText %></p> \
                                              </div> \
                                        </div> \
                                 </div> \
                            </div> \
                        </div> \
                        <div class="box"> \
                            <h3>Number of words added per day</h3> \
                            <img src="http://chart.googleapis.com/chart?cht=bvg&chs=435x300&chd=t:<%= graphs.publishedWords() %>&chxt=x,y&chxr=1,0,<%= (graphs.publishedMaxOfWords() + 1) %>,5&chds=0,<%= (graphs.publishedMaxOfWords() + 1) %>&chxl=0:|<%= graphs.publishedDays() %>&chdl=<%= graphs.publishedDays() %>&chco=00FF00&chm=N,000000,0,-1,12&chf=bg,s,F5F5F5" alt="Number of words added per day" /> \
                         </div>\
                         <div class="box"> \
                            <h3>Activities per day</h3> \
                            <img src="http://chart.googleapis.com/chart?cht=bvo&chs=435x300&chd=t:<%= graphs.activitiesMistakes() %>|<%= graphs.activitiesWords() %>&chxt=x,y&chxr=1,0,<%= (graphs.activitiesMaxOfWords() + 5) %>,5&chds=0,<%= (graphs.activitiesMaxOfWords() + 1) %>&chxl=0:|<%= graphs.activitiesDays() %>&chdl=Mistakes|Words&chco=FF0000,00FF00&chm=N,000000,-1,,12|N,000000,0,,12&chf=bg,s,F5F5F5" alt="Activities per day" /> \
                         </div>\
                   </div> \
                    <div class="span8" > \
                        <div class="box"> \
                            <h3>Today\'s success</h3> \
                            <img src="http://chart.apis.google.com/chart?cht=gom&chs=435x230&chxt=x,y&chd=t:<%= graphs.success %>&chl=<%= graphs.success %>%&chco=FF0000,00FF00&chf=bg,s,F5F5F5" alt="success" width="435" height="230" /> \
                             <% if( !_.isEmpty( errors ) ){%> \
                                <div class="box"> \
                                    <h3>Mistakes</h3> \
                                    <table class="zebra-striped"> \
                                        <thead> \
                                            <tr> \
                                                <th>Term</th> \
                                                <th>Items</th> \
                                                <th>Sound</th> \
                                            </tr> \
                                        </thead> \
                                        <tbody> \
                                            <% _.each(errors, function(word, idx) { %> \
                                                <tr> \
                                                    <td><strong><%= word.get(\'term\') %></strong></td> \
                                                    <td><%= word.get(\'items\') %></td> \
                                                    <td><img data-model="<%= word.get(\'term\') %>" class="voice-button" src="images/voice.png" alt="voice" /></td> \
                                                </tr> \
                                            <% }); %> \
                                        </tbody> \
                                    </table> \
                                    <p align="right"> \
                                        <button id="practice-finish-error-button" class="btn primary" autofocus="autofocus">Practice</button> \
                                    <\p> \
                                </div> \
                            <% } %> \
                        </div>\
                    </div> \
                </div> \
            '
}

$(function(){
	
	window.PracticeTestView = Backbone.View.extend({		
		
		el: $("#practice-test-page"),
			
		isTextTemplate: 1,
		isNextWord: 0,
		isFinish: 0,
		errors: [],		              
				
		SWITCH_TEMPLATE_FOR: 7, //word
		                               		
                textTemplate: _.template( CZ_KIBO_DRILUJEME2_TEMPLATES.TEXT ),
		radioTemplate: _.template( CZ_KIBO_DRILUJEME2_TEMPLATES.RADIO ),
		finishTemplate: _.template( CZ_KIBO_DRILUJEME2_TEMPLATES.FINISH ),
		isEmptyTemplate: _.template( $('#practice-isEmpty-template').html() ),
		
		initialize: function(){                                            
                    this.words = new WordList;    		
                    this.index = 0;
                    this.render();
                },
    	
                events:{		
                    "click #practice-text-check-button":                "bClick",					
                    "keypress #practice-text-input":                    "bClick",
                    "keypress #practice-words-preview li label input":  "bClick",               		
                    "click #practice-finish-error-button":              "practiceErrors",
                    "click .voice-button":                              "playSound"
		},
		
		playSound:function( event ){
                    if( event ){
                        this.words.get ( $(event.target).attr('data-model')).playSound();
                    }else{
                        this.words.at(this.index).playSound();
                    }                    			
		},
							
		bClick: function( event ){
			                                      
			if( event.which != 13 && event.which != 1 ) return;                        
						
			if( this.isNextWord ){
				this.next();
				this.isNextWord = 0;
				this.$('#practice-text-check-button').text('Check');
			}else{
				this.check();
				this.isNextWord = 1;
				this.$('#practice-text-check-button').text('Next');
			}			
		},
		
		next:function(){
								
			this.index +=1;
							
			if( this.index >= this.words.length ){
				
				if(this.isTextTemplate){
					this.switchTemplate();
				}else{
					this.finish();
				}
											
			}else if( ( this.index % this.SWITCH_TEMPLATE_FOR ) == 0 ){						
				this.switchTemplate();							
			}
			
			this.render();
		},
		
		switchTemplate:function(){							
			if( this.isTextTemplate ){				
				this.isTextTemplate = 0;
				this.reduceIndex();
			}else{
				this.isTextTemplate = 1;
			}						
		},
		
		reduceIndex:function(){
			if( ( this.index % this.SWITCH_TEMPLATE_FOR ) == 0 ){
				this.index -= this.SWITCH_TEMPLATE_FOR;							
			}else{				
				this.index -= ( this.index % this.SWITCH_TEMPLATE_FOR ) ;			
			}			
		},
					
		check:function(){
			
			this.playSound();
			
			var word = this.words.at( this.index );
			var gravity = word.get('gravity');
			var isError = false;
			
			if( this.isTextTemplate ){
				var input = this.$("#practice-text-input");			
				var val = input.val().trim();
				isError = !(val == word.get('term') );				
								
			}else{
				var checked = this.$('#practice-words-preview li input:checked');
                                var val = checked.val().trim();
                                isError = !(val == word.get('items') );
				//var valueArray = ( checked.val() ) ? checked.val().split(', ') : [];
				//isError = !(  _.isEqual(valueArray, word.get('items') ));				
			}
			
			if( isError ){					
				this.addToErrors();
			}
			
			this.showAnswer( isError );									
		},
					
		showAnswer:function( isError ){
			this.$('#practice-text-term span').text( this.words.at(this.index).get('term') );
			
			if( isError ){
				this.$('#practice-text-input').css( {'background-color' : 'red', 'color': 'white'} );
				this.$('#practice-words-preview li input:checked').next().css( {'background-color' : 'red', 'color': 'white', 'padding':'0 5px', 'border-radius':'5px'} );
			}else{
				this.$('#practice-text-input').css( {'background-color' : 'green', 'color': 'white'} );
				this.$('#practice-words-preview li input:checked').next().css( {'background-color' : 'green', 'color': 'white', 'padding':'0 5px', 'border-radius':'5px'} );			
			}
		},
		
		addToErrors:function(){	
			if( ! _.include( this.errors, this.words.at( this.index ) ) ){
				this.errors.push( this.words.at( this.index ) );
			}						
		},
			
		finish:function(){	
			this.isFinish = 1;	
			this.saveResult(); 
                        
                        this.graphs = new Graph({'words': this.words.length, 'mistakes': this.errors.length});
                        this.graphs.savePracticeResult();
                        this.graphs.computeSuccess();
                        this.graphs.computeKarma();
		},
		
		saveResult:function(){
			
			//false answer
			_.each(this.errors, function(word, idx) {
				var gravity = word.get('gravity');
				var today = new Date();
				word.set( {'gravity': gravity + 1, 'errorDate': new Date(today.getFullYear(), today.getMonth(), today.getDate() ).getTime()} );
				word.save();
			});	
			
			//true answer		
			_.each( _.difference(this.words.models, this.errors) , function(word, idx) {
				var gravity = word.get('gravity');
				word.set( {'gravity': gravity - 1} );
				word.save();				
			});			
		},
                               		
		practiceErrors:function(){			
			this.words.reset( this.errors );
			this.errors = [];
			this.index = 0;
			this.isTextTemplate = 1;
			this.isFinish = 0;
			this.render();
		},
		
		alternative:function( word ){
                    var COUNT_OF_ITEMS = 5; 			
                    var items = this.words.pluck("items");			
                    var sItems = _.shuffle( items ); 			
                    var slicedItems = sItems.slice(0, COUNT_OF_ITEMS);
			
                    if (! _.include( slicedItems, word.get('items') ) ){    				
                            console.log ('add to list:'  + word.get('items') )	
                            slicedItems[ (COUNT_OF_ITEMS - 1) ] = word.get('items');
                    }

                    return _.shuffle( slicedItems ); 
                },
											
		render:function(){	
			
			if(this.isFinish ){
				this.$("#practice-test-view").html( this.finishTemplate( {'errors': this.errors, 'graphs': this.graphs}) );                                
			
			}else if(this.words.length == 0){
				this.$("#practice-test-view").html( this.isEmptyTemplate() );
			
			}else if( this.isTextTemplate ){
				this.$("#practice-test-view").html( this.textTemplate( {'word': this.words.at( this.index ).toJSON()}) );
				
			}else{
				this.playSound();
				this.$("#practice-test-view").html( this.radioTemplate( {'word': this.words.at( this.index ).toJSON(), 'alternative':this.alternative( this.words.at( this.index ) )}) );
				this.$("#practice-words-preview li:nth-child(1) input").attr('checked','checked').focus();				
			}							
			return this;
		}		
	});
	
    window.practiceTest  = new PracticeTestView;	            
}); 