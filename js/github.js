// import GitHub from 'github-api';

const username = 'hsiuhsiu';
const repoName = 'ponti_wiki';
const branchName = 'master';
const filePath = 'wiki/index.html'

export function onSubmit(form) {
  const accessToken = form.token || form.querySelector('#password').value;

  const gh = new GitHub({
    token: accessToken
  });

  var fileName = filePath.split(/(\\|\/)/g).pop();
  var fileParent = filePath.substr(0, filePath.lastIndexOf("/"));
  var repo = gh.getRepo(username, repoName);

  fetch('https://api.github.com/repos/' +
    username + '/' +
    repoName + '/git/trees/' +
    encodeURI(branchName + ':' + fileParent), {
      headers: {
        "Authorization": "token " + accessToken
      }
    }).then(function(response) {
    return response.json();
  }).then(function(content) {
    var file = content.tree.filter(entry => entry.path === fileName);

    if (file.length > 0) {
      console.log("get blob for sha " + file[0].sha);
      //now get the blob
      repo.getBlob(file[0].sha).then(function(response) {
        console.log("response size : " + response.data.length);
        var newDoc = document.open("text/html", "replace");
        newDoc.write(response.data);
        newDoc.close();
      });
    } else {
      console.log("file " + fileName + " not found");
    }
  });
}
window.onSubmit = onSubmit;