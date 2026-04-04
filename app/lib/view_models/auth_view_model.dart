import 'package:flutter/material.dart';

class AuthViewModel extends ChangeNotifier {
  bool _isLoading = false;
  bool get isLoading => _isLoading;

  void setLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }

  // Placeholder logic to be hooked to Firebase later
  Future<void> login(String email, String password) async {
    setLoading(true);
    await Future.delayed(const Duration(seconds: 1)); // Simulate network
    setLoading(false);
  }
}
