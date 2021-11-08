import { USER_STATE_CHANGE } from "../constants";
import firebase from "@firebase/app-compat";

export function fetchUser() {
    return ((dispatch) => {
        firebase.firestore().collection("User")
        .doc(firebase.auth().currentUser.uid)
        .get()
        .then((snapshot) => {
            if (snapshot.exists) {
                dispatch({type: USER_STATE_CHANGE, currentUser: snapshot.data()});
            }
            else {
                console.log('Does not exist');
            }
        })
    })
}