
//   var radioInput = function(name, displayNames, values) {
//     var inputs = "";

//     for(var i = 0, len = displayNames.length; i < len; i++){
//       inputs += '<span class="radioButton"'+ (Vars.lookup[name] === values[i] ? ' style="background: #239f2b; color:#fff"':'')+'>';
//       inputs += '<input type="radio" id="'+name+i+'" name="'+name+'" onchange="CSS.radio(this)"';
//       inputs += 'value="'+values[i]+'" '+(Vars.lookup[name] === values[i] ? ' checked "':'')+' >';
//       inputs += '<label for="'+name+i+'">'+displayNames[i]+'</label></span>';
//     }
//     return inputs;
//   };

//   var textInput = function(name){
//     return '<input type="text" name="'+name+'" id="'+name+'" value="'+Vars.get(name)+'">';
//   };

//   var label = function(name, display) {
//     return '<label for="'+name+'">'+display+': </label>';
//   };

//   var inputRow = function(text, input) {
//     return '<div class="search-row"><span class="search-left">'+text+'</span><span>'+input+"</span></div>";
//   };

//   var selectTime = function() {
//     var values = ["hour", "12hour", "day", "week", "month", "6month", "year", "all"];
//     var display = ["past hour", "past 12 hours", "past day", "past week", "past month", "past 6 months", "past year", "all time"];
//     var html = '<select name="time" id="time">';

//     for(var i = 0, len = values.length; i < len; i++) {
//       html += '<option value="'+values[i]+'"' + ((Vars.get("time") === values[i]) ? " selected" : '')+'>'+display[i]+'</option>';
//     }

//     return html + "</select>";
//   };

//   var select = function(name, display, values){
//     var html = '<select name="'+name+'" id="'+name+'">';

//     for(var i = 0, len = values.length; i < len; i++) {
//       html += '<option value="'+values[i]+'"' + ((Vars.get(name) === values[i]) ? " selected" : '')+'>'+display[i]+'</option>';
//     }

//     return html + "</select>";
//   };

// return {
//   createSearch: function(){
//     var searchBox = document.createElement("div");
//     searchBox.id = "main-box";
//     searchBox.className = "search-box";
//   /*
//     Comments:
//     text      (body)    string
//     title     (title)    string
//     subreddit    (subreddit)  string
//     author    (author)    string
//     over_18    (over_18)    sfw,nsfw,both *
//     locked    (locked)    bool *
//     between    (after/before)  "date"
//     sort     (sort)    asc,desc
//   */
//     var html = inputRow('Im looking for: ', radioInput("thread", ["Thread","Comment"], ["true", "false"]));
//     html += inputRow(label("text", "Text"), textInput("text"));
//     html += inputRow(label("title","Title"), textInput("title"));
//     html += inputRow(label("subreddit", "Subreddit"), textInput("subreddit"));
//     html += inputRow(label("author", "Author"), textInput("author"));
//     html += inputRow("Over 18: ", radioInput("over_18", ["Both","NSFW","SFW"], ["both","nsfw","sfw"]));
//     html += inputRow("Locked: ", radioInput("locked", ["Both","True", "False"], ["both","true","false"]));
//     html += inputRow("Removed: ", select("removed", ["Removed and non-removed", "Only removed", "Only deleted"], ["all", "removed", "deleted"]));
//     html += inputRow("From:", selectTime());
//     html += inputRow("Sort: ", select("sort", ["Highest score","Lowest score","Newest","Oldest"], ["score_desc","score_asc","time_desc","time_asc"]));
//     html += '<input type="button" value="'+(showAdvanced?'Hide':'Show')+' advanced">';
//     html += '<input type="submit" value="Search">';
//     searchBox.innerHTML = html;

//     mainDiv.appendChild(searchBox);
