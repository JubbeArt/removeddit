import { json, flatten } from 'utils'
import { fetchToken, redditAuth } from 'reddit/token'

let cachedThread = {}
export const lookup = {}

export const getThread = (subreddit, threadID) => (
  fetchToken()
    .then(() => fetch(`https://oauth.reddit.com/r/${subreddit}/comments/${threadID}`, redditAuth))
    .then(json)
    .then(results => {
      // Save the comments for later
      cachedThread = results

      // Return the thread
      return results[0].data.children[0].data
    })
)

const handleThreadComment = (comment, results) => {
  if (comment.kind === 't1') {
    // Has comment replies
    if (comment.data.replies) {
      // Handle all replies in the same way
      comment.data.replies.data.children.forEach(reply => handleThreadComment(reply, results))
      delete comment.data.replies
    }

    // Add to the return object
    results.ids.push(comment.data.id)
    // Store commment in lookup table
    lookup[comment.data.id] = comment.data
  } else if (comment.kind === 'more') {
    if (comment.data.id === '_') {
      // "continue this thread" comment
      results.continueThisThreadIDs.push(comment.data.parent_id);
    } else if (comment.data.children.length < comment.data.count) {
      // "Load more"-comment (that is missing some of its children)
      results.morechildrenIDs.push(comment.data.children)
    }

    // Always add the "more"-comments children
    results.ids.push(...comment.data.children)
  } else {
    console.error('WTF', comment.kind)
  }

  return results
}

const handleMoreChildren = () => {

}

const handleThread = thread => {
  const comments = thread[1].data.children

  // Ugly "hack", using this object as a pointer for storing comments.
  // Not very js-like
  const results = {
    ids: [],
    continueThisThreadIDs: [],
    morechildrenIDs: [],
  }

  comments.map(comment => handleThreadComment(comment, results))
  const { ids, continueThisThreadIDs, morechildrenIDs } = results

  console.log(ids)
  console.log(continueThisThreadIDs)
  console.log(morechildrenIDs)

  handleMoreChildren()
}

export const getCommentIDs = () => handleThread(cachedThread)

//       return HandleIDs.morechildren()
//       .catch(function(error){
//         return Promise.reject("Could not get comments from Reddit (moreChildren)");
//       });
//     })
//     .then(function(){
//       return Promise.all(_.map(_.uniq(Comments.countinuethread), function(id) {
//         return fetch(URLs.thread+"/_/"+id.split("_")[1], Reddit.init)
//         .then(Fetch2.json)
//         .catch(function(error){ return Promise.reject("Could not get comments from Reddit (continueThisThread)") })
//       }))
//       .catch(function(error){
//         return Promise.reject("Could not get comments from Reddit (continueThisThread)");
//       });
//     })
//     .then(function(smallerThreads){
//       _.forEach(smallerThreads, function(thread){
//         HandleIDs.normal(thread);
//       })
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
//   var lookup = {};
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

// return {
//   ids: [], // The comments we found
//   morechildren: [],
//   countinuethread: [],

//   allIDs: [], // All the comments that we were suppose to find
//   removed: [],
//   deleted: [],
//   toBeCreated: toBeCreated,
//   lookup: lookup,

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


// // ------------------------------------------------------------------------------
// // ----------------- Handle comments from different requests --------------------
// // ------------------------------------------------------------------------------
// var HandleIDs = (function(){
//   var normal = function(thread){
//     return _.flatten(_.map(thread[1].data.children, Extract.normal))
//   };

//   var morechildren = function(){
//     return Promise.all(_.map(_.uniq(Comments.morechildren), function(idArray){
//       return Fetch2.multiple(URLs.format(URLs.moreChildren, idArray), Reddit.init);
//     }))
//     .then(function(responseArrays){
//       Comments.morechildren.length = 0;
//       _.forEach(responseArrays, function(responseArray){
//         _.forEach(responseArray, function(response){
//           _.forEach(response.jquery[10][3][0], function(comment){
//             Extract.normal(comment);
//           })
//         });
//       });
//     }).then(function(){
//       if(Comments.morechildren.length !== 0) {
//         return morechildren();
//       }
//     });
//   };

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

//   return {
//     normal: normal,
//     morechildren: morechildren,
//     removed: removed
//   };
// })();

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

