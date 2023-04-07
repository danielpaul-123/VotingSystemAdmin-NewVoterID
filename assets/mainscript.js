const bk = document.getElementById('beck');
const submiter = document.getElementById('submit');
const form = document.querySelector("form");

const firebaseConfig = {
  apiKey: "AIzaSyCjkXPnUijS3uYWvuPheSjJeFvoiZ7nrQ0",
  authDomain: "election-online-prj.firebaseapp.com",
  databaseURL: "https://election-online-prj-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "election-online-prj",
  storageBucket: "election-online-prj.appspot.com",
  messagingSenderId: "281761267368",
  appId: "1:281761267368:web:fb0663844a76d66df40c9d"
};

firebase.initializeApp(firebaseConfig);

bk.addEventListener("click",function(event){
  event.preventDefault();
  window.location.replace("../index.html");
})

submiter.addEventListener("click",async function(event){
  event.preventDefault();

  //Read from firebase code, compare keyword with argon2id hash to login
  // argon2.hash({
  //   pass:"dibin",
  //   salt:random(16),
  //   time:2,
  //   mem:16384,
  //   hashLen:32,
  //   parallelism:1,
  //   type:argon2.ArgonType.Argon2id,
  //   }).then(h => console.log("Username: ",h.encoded))
  //   .catch(e => console.error(e.message, e.code));
  
  var uname = document.getElementById("unm").value;

  argon2.hash({
    pass:uname,
    salt:random(16),
    time:2,
    mem:16384,
    hashLen:32,
    parallelism:1,
    type:argon2.ArgonType.Argon2id,
    }).then(h => {const hashuname = h.encoded;
      argonpass(hashuname);
      }).catch(e => console.error(e.message, e.code));
})

function argonpass(_hashuname)
{
  const hashuname = _hashuname;
  var pass = document.getElementById("pwd").value;
  argon2.hash({
    pass:pass,
    salt:random(16),
    time:2,
    mem:16384,
    hashLen:32,
    parallelism:1,
    type:argon2.ArgonType.Argon2id,
    }).then(h => {const hashpass = h.encoded;
    firestoreupload(hashuname,hashpass);
    }).catch(e => console.error(e.message, e.code));
}

function firestoreupload(_hashuname,_hashpass)
{
  var vid = document.getElementById("vid").value;
  const hashuname = _hashuname;
  const hashpass = _hashpass;
  const firestore = firebase.firestore();
  var collectionref = firestore.collection("Test_User").doc(vid);

  const data = {
    Username: hashuname,
    Password: hashpass,
  };

collectionref.set(data)
.then(() => {
  electionupdate(vid);
  imageupload(vid);
  form.reset();
})
.catch((error) => {
  console.error("Error adding document: ", error);
});
}

function electionupdate (_voterid)
{
  var voterid = _voterid;
  const firestore = firebase.firestore();
  var voterdocument = firestore.collection("Test_User").doc(voterid);
  var electioncollection = firestore.collection("Election_Data");

  electioncollection.get().then((querySnapshot) => {
    // Loop through the documents
    querySnapshot.forEach((doc) => {
      // doc.data() is the document contents
      const docid = doc.id;
      const data = {
        [docid]: 0,
      }

      voterdocument.update(data)
      .then(() => {
        form.reset();
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
    });
  });
}

function imageupload(_voterid)
{
  let voterid = _voterid+".jpg";
  const profile = document.getElementById("pimg").files[0];
  const storageRef = firebase.storage().ref().child('user_profile/'+voterid);
  storageRef.put(profile).then((snapshot) => {
    console.log('Succesfull!');
  })
}
