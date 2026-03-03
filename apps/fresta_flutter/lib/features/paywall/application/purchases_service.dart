import 'dart:io';

import 'package:flutter/foundation.dart';
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
  bool get isConfigured => _isConfigured;

  Future<void> init() async {
    if (_isConfigured) return;

    await Purchases.setLogLevel(LogLevel.debug);

    PurchasesConfiguration? configuration;

    if (Platform.isAndroid) {
      final googleKey = dotenv.env['FRESTA_REVENUECAT_GOOGLE_KEY'];
      debugPrint('[PurchasesService] Android key: ${googleKey != null ? "present" : "missing"}');
      if (googleKey != null && googleKey.isNotEmpty) {
        configuration = PurchasesConfiguration(googleKey);
      }
    } else if (Platform.isIOS) {
      final appleKey = dotenv.env['FRESTA_REVENUECAT_APPLE_KEY'];
      debugPrint('[PurchasesService] iOS key: ${appleKey != null ? "present (${appleKey.substring(0, 8)}...)" : "missing"}');
      if (appleKey != null && appleKey.isNotEmpty) {
        configuration = PurchasesConfiguration(appleKey);
      }
    }

    if (configuration != null) {
      try {
        await Purchases.configure(configuration);
        _isConfigured = true;
        debugPrint('[PurchasesService] SDK configured successfully');
      } catch (e) {
        debugPrint('[PurchasesService] SDK configure FAILED: $e');
        return;
      }
      
      // Attempt to identify user if logged in
      final user = ref.read(authControllerProvider).user;
      if (user != null) {
        await Purchases.logIn(user.id);
        debugPrint('[PurchasesService] Logged in as ${user.id}');
      }
    } else {
      debugPrint('[PurchasesService] No configuration found — SDK NOT configured');
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
    if (!_isConfigured) {
      debugPrint('[PurchasesService] getOfferings: SDK not configured');
      return null;
    }
    try {
      final offerings = await Purchases.getOfferings();
      debugPrint('[PurchasesService] getOfferings: current=${offerings.current?.identifier}, all=${offerings.all.keys.toList()}');
      if (offerings.current != null) {
        final pkgs = offerings.current!.availablePackages;
        debugPrint('[PurchasesService] packages: ${pkgs.map((p) => '${p.packageType.name}=${p.storeProduct.identifier}').toList()}');
      }
      return offerings;
    } on PlatformException catch (e) {
      debugPrint('[PurchasesService] getOfferings ERROR: ${e.code} ${e.message}');
      return null;
    }
  }

  /// Busca o produto diretamente do StoreKit/Play Store sem precisar de Offering.
  /// Funciona com o arquivo Fresta.storekit no simulador.
  Future<StoreProduct?> getDirectProduct() async {
    if (!_isConfigured) {
      debugPrint('[PurchasesService] getDirectProduct: SDK not configured');
      return null;
    }
    try {
      final productId = Platform.isAndroid
          ? 'com.storyspark.fresta.plus'
          : 'com.storyspark.fresta.calendar.plus';
      debugPrint('[PurchasesService] getDirectProduct: fetching $productId');
      
      // Tentar primeiro sem categoria (deixa StoreKit resolver)
      var products = await Purchases.getProducts([productId]);
      debugPrint('[PurchasesService] getDirectProduct (sem categoria): ${products.length} produtos');
      
      // Se não encontrou, tentar com categoria explícita  
      if (products.isEmpty) {
        products = await Purchases.getProducts(
          [productId],
          productCategory: ProductCategory.nonSubscription,
        );
        debugPrint('[PurchasesService] getDirectProduct (nonSubscription): ${products.length} produtos');
      }
      
      if (products.isNotEmpty) {
        debugPrint('[PurchasesService] getDirectProduct FOUND: ${products.first.identifier} ${products.first.priceString}');
      }
      return products.isNotEmpty ? products.first : null;
    } on PlatformException catch (e) {
      debugPrint('[PurchasesService] getDirectProduct ERROR: ${e.code} ${e.message}');
      return null;
    }
  }

  Future<bool> purchaseStoreProduct(StoreProduct product, String calendarId) async {
    if (!_isConfigured) return false;
    try {
      debugPrint('[PurchasesService] purchaseStoreProduct: starting ${product.identifier}');
      final purchaseResult = await Purchases.purchaseStoreProduct(product);
      debugPrint('[PurchasesService] purchaseStoreProduct: SUCCESS, transactions=${purchaseResult.customerInfo.nonSubscriptionTransactions.length}');
      final transaction = purchaseResult.customerInfo.nonSubscriptionTransactions.isNotEmpty
          ? purchaseResult.customerInfo.nonSubscriptionTransactions.last
          : null;
      final transactionId = transaction?.transactionIdentifier ??
          DateTime.now().millisecondsSinceEpoch.toString();

      try {
        await ref.read(calendarsRepositoryProvider).activatePremiumCalendar(
          calendarId: calendarId,
          transactionId: transactionId,
          productId: product.identifier,
        );
        debugPrint('[PurchasesService] activatePremiumCalendar: OK');
      } catch (supabaseError) {
        debugPrint('[PurchasesService] activatePremiumCalendar ERROR (pagamento OK): $supabaseError');
        // Pagamento foi feito — continua mesmo se Supabase falhar
      }
      return true;
    } on PlatformException catch (e) {
      final errorCode = PurchasesErrorHelper.getErrorCode(e);
      debugPrint('[PurchasesService] purchaseStoreProduct PlatformException: code=${e.code} msg=${e.message} rcCode=$errorCode');
      if (errorCode == PurchasesErrorCode.purchaseCancelledError) return false;
      rethrow;
    } catch (e) {
      debugPrint('[PurchasesService] purchaseStoreProduct ERROR: $e');
      rethrow;
    }
  }

  Future<bool> purchasePackage(Package package, String calendarId) async {
    if (!_isConfigured) return false;
    try {
      debugPrint('[PurchasesService] purchasePackage: starting ${package.storeProduct.identifier}');
      final purchaseResult = await Purchases.purchasePackage(package);
      debugPrint('[PurchasesService] purchasePackage: SUCCESS, transactions=${purchaseResult.customerInfo.nonSubscriptionTransactions.length}');
      final transaction = purchaseResult.customerInfo.nonSubscriptionTransactions.isNotEmpty 
          ? purchaseResult.customerInfo.nonSubscriptionTransactions.last
          : null;

      final transactionId = transaction?.transactionIdentifier ?? DateTime.now().millisecondsSinceEpoch.toString();
      final productId = package.storeProduct.identifier;

      try {
        await ref.read(calendarsRepositoryProvider).activatePremiumCalendar(
          calendarId: calendarId,
          transactionId: transactionId,
          productId: productId,
        );
        debugPrint('[PurchasesService] activatePremiumCalendar: OK');
      } catch (supabaseError) {
        debugPrint('[PurchasesService] activatePremiumCalendar ERROR (pagamento OK): $supabaseError');
        // Pagamento foi feito — continua mesmo se Supabase falhar
      }
      return true;
    } on PlatformException catch (e) {
      final errorCode = PurchasesErrorHelper.getErrorCode(e);
      debugPrint('[PurchasesService] purchasePackage PlatformException: code=${e.code} msg=${e.message} rcCode=$errorCode');
      if (errorCode == PurchasesErrorCode.purchaseCancelledError) return false;
      rethrow;
    } catch (e) {
      debugPrint('[PurchasesService] purchasePackage ERROR: $e');
      rethrow;
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
