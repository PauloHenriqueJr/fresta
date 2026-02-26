import 'dart:io';

import 'package:flutter/services.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:purchases_flutter/purchases_flutter.dart';

import '../../auth/application/auth_controller.dart';

final purchasesServiceProvider = Provider<PurchasesService>((ref) {
  return PurchasesService(ref);
});

class PurchasesService {
  PurchasesService(this.ref);
  final Ref ref;

  bool _isConfigured = false;

  Future<void> init() async {
    if (_isConfigured) return;

    await Purchases.setLogLevel(LogLevel.debug);

    PurchasesConfiguration? configuration;

    if (Platform.isAndroid) {
      final googleKey = dotenv.env['FRESTA_REVENUECAT_GOOGLE_KEY'];
      if (googleKey != null && googleKey.isNotEmpty) {
        configuration = PurchasesConfiguration(googleKey);
      }
    } else if (Platform.isIOS) {
      final appleKey = dotenv.env['FRESTA_REVENUECAT_APPLE_KEY'];
      if (appleKey != null && appleKey.isNotEmpty) {
        configuration = PurchasesConfiguration(appleKey);
      }
    }

    if (configuration != null) {
      await Purchases.configure(configuration);
      _isConfigured = true;
      
      // Attempt to identify user if logged in
      final user = ref.read(authControllerProvider).user;
      if (user != null) {
        await Purchases.logIn(user.id);
      }
    }
  }

  Future<void> logIn(String userId) async {
    if (!_isConfigured) return;
    try {
      await Purchases.logIn(userId);
    } catch (e) {
      // Ignored
    }
  }

  Future<void> logOut() async {
    if (!_isConfigured) return;
    try {
      await Purchases.logOut();
    } catch (e) {
      // Ignored
    }
  }

  Future<Offerings?> getOfferings() async {
    if (!_isConfigured) return null;
    try {
      return await Purchases.getOfferings();
    } on PlatformException catch (_) {
      return null;
    }
  }

  Future<bool> purchasePackage(Package package) async {
    if (!_isConfigured) return false;
    try {
      final purchaseResult = await Purchases.purchasePackage(package);
      final isPremium = purchaseResult.customerInfo.entitlements.all['premium']?.isActive ?? false;
      return isPremium;
    } on PlatformException catch (e) {
      final errorCode = PurchasesErrorHelper.getErrorCode(e);
      if (errorCode != PurchasesErrorCode.purchaseCancelledError) {
        // Log error
      }
      return false;
    }
  }

  Future<bool> checkPremiumEntitlement() async {
    if (!_isConfigured) return false;
    try {
      final customerInfo = await Purchases.getCustomerInfo();
      return customerInfo.entitlements.all['premium']?.isActive ?? false;
    } catch (e) {
      return false;
    }
  }

  Future<bool> restorePurchases() async {
    if (!_isConfigured) return false;
    try {
      final customerInfo = await Purchases.restorePurchases();
      return customerInfo.entitlements.all['premium']?.isActive ?? false;
    } catch (e) {
      return false;
    }
  }
}
