export { getPost } from './thread'
export { getComments } from './comment'
//       Status.loading("Getting removed comments...");
//       HandleIDs.removed();
//       ThreadHTML.createCommentInfo(Comments.removed.length);
//       return Fetch2.multiple(URLs.format(URLs.pushshiftComments, Comments.removed), null, "data")
//       .catch(function(error){
//         return Promise.reject("Could not get removed comments");
//       });
//     })
//     .then(function(removedComments){
//       Status.loading("Generating comments...");
//       return Comments.generate(removedComments);
//     })
//     .then(function(){
//       Status.success();
//     })
//     .catch(function(error) {
//       if(_.includes(_.toLower(error), "error")) {
//         Status.error(error);
//       } else {
//         Status.error("Error: "+error);
//       }
//     });
//   }
// }})();

// // ------------------------------------------------------------------------------
// // ----------------------- Store and genrates comments --------------------------
// // ------------------------------------------------------------------------------
// var Comments = (function() {
//   var totalComments;
//   var toBeCreated = [];

//   var getParentComments = function(toLookup){
//     var newCommentsToLookup = [];
//     var commentsToFetch = [];

//     _.forEach(toLookup, function(id){
//       var parentID = lookup[id].parent_id.split("_")[1];

//       if(parentID === Reddit.threadID) {} // Has no parent (is parent of thread)
//       else if(_.includes(Comments.toBeCreated, parentID)) {} // Parent already exists, do nothing
//       else if(_.includes(newCommentsToLookup, parentID)) {} // Parent already exists (this iteration)
//       else if(_.has(lookup, parentID)) {
//           newCommentsToLookup.push(parentID);
//       } else{
//         commentsToFetch.push(parentID);
//       }

//       Comments.toBeCreated.push(id);
//     });

//     return new Promise(function(resolve, reject){
//       if(_.uniq(commentsToFetch).length !== 0) {
//         fetch(URLs.singleComments + _.join(_.map(_.uniq(commentsToFetch),function(comments){
//           return "t1_" + comments;
//         })), Reddit.init)
//         .then(Fetch2.json)
//         .then(function(json){
//           _.forEach(json.data.children, function(comment) {
//             lookup[comment.data.id] = comment.data;
//             newCommentsToLookup.push(comment.data.id);
//           });
//         })
//         .then(function(){
//           resolve();
//         });

//       } else {
//         resolve();
//       }
//     })
//     .then(function(){
//       if(newCommentsToLookup.length !== 0) {
//         return getParentComments(newCommentsToLookup)
//       }
//     });

//   };

//   allIDs: [], // All the comments that we were suppose to find
//   removed: [],
//   deleted: [],
//   toBeCreated: toBeCreated,

//   getTotalComments: function() { return totalComments; },
//   setTotalComments: function(total) { totalComments = total; },

//   getRoot: function() {
//     if(Reddit.permalink !== undefined && Reddit.permalink === "") {
//       return Reddit.threadID;
//     }

//     if(Reddit.permalink === undefined) {
//       return Reddit.threadID;
//     }

//     if(_.has(Comments.lookup, Reddit.permalink)) {
//       return Comments.lookup[Reddit.permalink].parent_id.split("_")[1];
//     }
//     return "";
//   },
//   generate: function(removedComments) {
//     removedComments.forEach(function(comment){
//       if(_.includes(Comments.deleted, comment.id)) {
//         comment["deleted"] = true;
//       } else {
//         comment["removed"] = true;
//       }

//       Comments.lookup[comment.id] = comment;
//     });

//     Comments.removed = _.map(removedComments, function(comment){
//       return comment.id;
//     });

//     return getParentComments(Comments.removed)
//     .then(function(){
//       ThreadHTML.createCommentSection();
//       ThreadHTML.createComments();
//     })
//   }
// }})();

//   var removed = function(){
//     Comments.removed = _.difference(Comments.allIDs, Comments.ids);

//     Comments.ids.forEach(function(id){
//       if(! _.has(Comments.lookup, id)) {
//         return;
//       }

//       if(Comments.lookup[id].body === "[removed]") {
//         Comments.removed.push(id);
//       } else if (Comments.lookup[id].body === "[deleted]"){
//         Comments.removed.push(id);
//         Comments.deleted.push(id);
//       }
//     });

//     Comments.removed = _.uniq(Comments.removed);
//   };


// // ------------------------------------------------------------------------------
// // ---------------------------- Generating HTML ---------------------------------
// // ------------------------------------------------------------------------------


//   var createComments = function(){
//     var commentsToCreate = _.sortBy(_.uniq(Comments.toBeCreated), function(id) {
//       return Comments.lookup[id].score;
//     });

//     var createdComments = [Comments.getRoot()];
//     var didSomething = false;

//     while(commentsToCreate.length > 0) {
//       didSomething = false;

//       for(var i = commentsToCreate.length - 1; i >= 0; i--) {
//         var id = commentsToCreate[i];
//         var parentID = Comments.lookup[id].parent_id.split("_")[1];

//         if(_.includes(createdComments, parentID)) {
//           document.getElementById(parentID).appendChild(createComment(Comments.lookup[id]));
//           createdComments.push(id);
//           commentsToCreate.splice(i, 1);
//           didSomething = true;
//         }
//       }

//       // Fail safe (parents missing for the rest of the comments, shouldn't happend but oh well :D)
//       if(!didSomething) {
//         console.error("Didn't generate all comments correctly");
//         break;
//       }
//     }
//   };

