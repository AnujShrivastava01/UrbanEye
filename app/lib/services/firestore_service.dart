import 'package:cloud_firestore/cloud_firestore.dart';

class FirestoreService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;

  Future<void> saveUserRecord(String uid, Map<String, dynamic> data) async {
    await _db.collection('users').doc(uid).set(data);
  }

  Future<DocumentSnapshot> getUserRecord(String uid) async {
    return await _db.collection('users').doc(uid).get();
  }
}
