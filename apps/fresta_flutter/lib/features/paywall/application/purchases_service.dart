import 'dart:io';

import 'package:flutter/services.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:purchases_flutter/purchases_flutter.dart';

import '../../auth/application/auth_controller.dart';
import '../../calendars/application/calendar_providers.dart';
import '../../../data/repositories/calendars_repository.dart';

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

  Future<bool> purchasePackage(Package package, String calendarId) async {
    if (!_isConfigured) return false;
    try {
      final purchaseResult = await Purchases.purchasePackage(package);
      final transaction = purchaseResult.customerInfo.nonSubscriptionTransactions.isNotEmpty 
          ? purchaseResult.customerInfo.nonSubscriptionTransactions.last
          : null;

      String transactionId = transaction?.transactionIdentifier ?? DateTime.now().millisecondsSinceEpoch.toString();
      String productId = package.storeProduct.identifier;

      // Link payment to the calendar in Supabase
      await ref.read(calendarsRepositoryProvider).activatePremiumCalendar(
        calendarId: calendarId,
        transactionId: transactionId,
        productId: productId,
      );

      return true;
    } on PlatformException catch (e) {
      final errorCode = PurchasesErrorHelper.getErrorCode(e);
      if (errorCode != PurchasesErrorCode.purchaseCancelledError) {
        // Log error
      }
      return false;
    } catch (e) {
      // Catch any Supabase errors
      return false;
    }
  }

  Future<bool> checkPremiumEntitlement(String calendarId) async {
    if (!_isConfigured) return false;
    try {
      // In this new per-calendar model, the "source of truth" is Supabase.
      // But we can check if there's any non-subscription transaction that might not have been synced.
      final customerInfo = await Purchases.getCustomerInfo();
      // If we wanted to be exhaustive, we'd check if any transaction matches this calendar.
      // But without a backend mapping of transactionId -> calendarId readily available here,
      // it's best to rely on the backend's 'is_premium' flag before even showing the paywall.
      // We return false here to let the Paywall screen rely on its own logic or to force a sync if needed.
      return false; 
    } catch (e) {
      return false;
    }
  }

  Future<bool> restorePurchases(String calendarId) async {
    if (!_isConfigured) return false;
    try {
      final customerInfo = await Purchases.restorePurchases();
      // Look for any non-subscription transactions
      if (customerInfo.nonSubscriptionTransactions.isNotEmpty) {
        // If we have transactions, we try to link the latest one to this calendar
        // (In a perfect world, we'd know exactly which transaction belongs to which calendar,
        // but for a rescue operation, linking the latest valid purchase to the current calendar can save a dropped connection).
        final transaction = customerInfo.nonSubscriptionTransactions.last;
        String transactionId = transaction.transactionIdentifier;
        String productId = transaction.productIdentifier;

        await ref.read(calendarsRepositoryProvider).activatePremiumCalendar(
          calendarId: calendarId,
          transactionId: transactionId,
          productId: productId,
        );
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }
}
