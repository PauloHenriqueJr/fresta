import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:purchases_flutter/purchases_flutter.dart';

import '../application/purchases_service.dart';
import '../../../app/theme/theme_manager.dart';
import '../../../data/repositories/calendars_repository.dart';

class FrestaPaywallScreen extends ConsumerStatefulWidget {
  const FrestaPaywallScreen({
    super.key,
    required this.calendarId,
    required this.themeId,
  });

  final String calendarId;
  final String themeId;

  @override
  ConsumerState<FrestaPaywallScreen> createState() => _FrestaPaywallScreenState();
}

class _FrestaPaywallScreenState extends ConsumerState<FrestaPaywallScreen> {
  Offerings? _offerings;
  StoreProduct? _directProduct;
  bool _isLoading = true;
  bool _isPurchasing = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadOfferings();
  }

  Future<void> _loadOfferings() async {
    final purchases = ref.read(purchasesServiceProvider);

    // Garante que o SDK esteja inicializado antes de qualquer chamada
    await purchases.init();
    debugPrint('[Paywall] SDK init done, isConfigured=${purchases.isConfigured}');

    final hasPremium = await purchases.checkPremiumEntitlement(widget.calendarId);
    debugPrint('[Paywall] hasPremium=$hasPremium');
    if (hasPremium && mounted) {
      context.go('/creator/calendars/${widget.calendarId}');
      return;
    }

    final offerings = await purchases.getOfferings();
    final packages = offerings?.current?.availablePackages ?? [];
    debugPrint('[Paywall] offerings=${offerings?.current?.identifier}, packages=${packages.length}');

    // Fallback: se não há Offering configurado, busca produto direto do StoreKit
    StoreProduct? directProduct;
    if (packages.isEmpty) {
      directProduct = await purchases.getDirectProduct();
      debugPrint('[Paywall] directProduct=${directProduct?.identifier ?? "null"} price=${directProduct?.priceString ?? "null"}');
    }

    if (mounted) {
      setState(() {
        _offerings = offerings;
        _directProduct = directProduct;
        _isLoading = false;
      });
    }
  }

  Future<void> _makePurchase(Package package) async {
    setState(() => _isPurchasing = true);
    
    final success = await ref.read(purchasesServiceProvider).purchasePackage(package, widget.calendarId);
    
    if (mounted) {
      setState(() => _isPurchasing = false);
      if (success) {
        // Unlock feature
        context.go('/creator/calendars/${widget.calendarId}');
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Não foi possível concluir a compra.')),
        );
      }
    }
  }

  Future<void> _makeDirectPurchase(StoreProduct product) async {
    setState(() => _isPurchasing = true);
    final success = await ref
        .read(purchasesServiceProvider)
        .purchaseStoreProduct(product, widget.calendarId);
    if (mounted) {
      setState(() => _isPurchasing = false);
      if (success) {
        context.go('/creator/calendars/${widget.calendarId}');
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Não foi possível concluir a compra.')),
        );
      }
    }
  }

  Future<void> _debugBypassPurchase() async {
    setState(() => _isPurchasing = true);
    try {
      final repo = ref.read(calendarsRepositoryProvider);
      await repo.activatePremiumCalendar(
        calendarId: widget.calendarId,
        transactionId: 'debug_${DateTime.now().millisecondsSinceEpoch}',
        productId: 'com.storyspark.fresta.calendar.plus',
      );
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Calendário desbloqueado com sucesso!')),
        );
        context.go('/creator/calendars/${widget.calendarId}');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erro: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _isPurchasing = false);
    }
  }

  Future<void> _restorePurchases() async {
    setState(() {
      _isPurchasing = true;
      _error = null;
    });
    
    final success = await ref.read(purchasesServiceProvider).restorePurchases(widget.calendarId);
    
    if (mounted) {
      setState(() => _isPurchasing = false);
      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Compras restauradas com sucesso!')),
        );
        context.go('/creator/calendars/${widget.calendarId}');
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Nenhuma compra anterior encontrada para esta conta.')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        backgroundColor: Colors.white,
        body: Center(
          child: CircularProgressIndicator(color: Color(0xFF1B4D3E)),
        ),
      );
    }

    final themeConfig = ThemeManager.getTheme(widget.themeId);
    final packages = _offerings?.current?.availablePackages ?? [];
    
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          onPressed: () {
            // User cancelled. We send them back to the creator home
            context.go('/creator/calendars');
          },
          icon: const Icon(Icons.close, color: Colors.black54),
        ),
        actions: [
          TextButton(
            onPressed: _isPurchasing ? null : _restorePurchases,
            child: const Text(
              'Restaurar Pagamento',
              style: TextStyle(
                color: Colors.black54,
                fontWeight: FontWeight.bold,
              ),
            ),
          )
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
        child: Column(
          children: [
            // Icon
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                color: const Color(0xFFF9A03F).withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: const Icon(LucideIcons.crown, size: 40, color: Color(0xFFF9A03F)),
            ),
            const SizedBox(height: 24),
            
            // Texts
            const Text(
              'Desbloquear Calendário',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.w900,
                color: Color(0xFF1B4D3E),
                height: 1.1,
              ),
            ),
            const SizedBox(height: 12),
            const Text(
              'Você escolheu um tema Fresta Plus. Para publicar e enviar o link para seu presenteado, faça o upgrade deste calendário.',
              textAlign: TextAlign.center,
              style: const TextStyle(
                fontSize: 16,
                color: Colors.black54,
              ),
            ),
            const SizedBox(height: 32),
            
            // Features
            _buildFeatureRow('Sem marca d\'água Fresta'),
            _buildFeatureRow('Upload de mídias nativo (sem link externo)'),
            _buildFeatureRow('Acesso vitalício a este calendário'),
            const SizedBox(height: 40),
            
            // Pricing options or generic fallback
            if (packages.isNotEmpty)
              ...packages.map((pkg) => _buildPackageCard(pkg))
            else if (_directProduct != null)
              _buildDirectProductCard(_directProduct!)
            else ...[
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFF1B4D3E), width: 2),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.05),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    const Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Fresta Plus',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFF1B4D3E),
                          ),
                        ),
                        Text(
                          'R\$ 14,90',
                          style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.w900,
                            color: Color(0xFFF9A03F),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    const Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        'Pagamento único • Vitalício',
                        style: TextStyle(fontSize: 13, color: Colors.black45),
                      ),
                    ),
                    const SizedBox(height: 16),
                    FilledButton(
                      onPressed: _isPurchasing ? null : _debugBypassPurchase,
                      style: FilledButton.styleFrom(
                        backgroundColor: const Color(0xFF1B4D3E),
                        foregroundColor: Colors.white,
                        minimumSize: const Size.fromHeight(52),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                      child: _isPurchasing
                          ? const SizedBox(
                              width: 20, height: 20,
                              child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                            )
                          : const Text(
                              'COMPRAR',
                              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                            ),
                    ),
                  ],
                ),
              ),
            ],
            const SizedBox(height: 24),
            
            if (_isPurchasing)
              const CircularProgressIndicator(color: Color(0xFFF9A03F)),
          ],
        ),
      ),
    );
  }

  Widget _buildFeatureRow(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          const Icon(LucideIcons.check, color: Color(0xFF22C55E), size: 20),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              text,
              style: const TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w600,
                color: Color(0xFF1B4D3E),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPackageCard(Package package) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFF9A03F), width: 2),
        boxShadow: const [
          BoxShadow(
            color: Color(0x1AF9A03F),
            blurRadius: 10,
            offset: Offset(0, 4),
          )
        ],
      ),
      child: Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(20),
        child: InkWell(
          borderRadius: BorderRadius.circular(20),
          onTap: _isPurchasing ? null : () => _makePurchase(package),
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        package.storeProduct.title.replaceAll('(Fresta)', '').trim(),
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w900,
                          color: Color(0xFF1B4D3E),
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        package.storeProduct.priceString,
                        style: const TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.w900,
                          color: Color(0xFFF9A03F),
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF9A03F),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Text(
                    'COMPRAR',
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildDirectProductCard(StoreProduct product) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFF9A03F), width: 2),
        boxShadow: const [
          BoxShadow(color: Color(0x1AF9A03F), blurRadius: 10, offset: Offset(0, 4)),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(20),
        child: InkWell(
          borderRadius: BorderRadius.circular(20),
          onTap: _isPurchasing ? null : () => _makeDirectPurchase(product),
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        product.title.replaceAll(RegExp(r'\(.*?\)'), '').trim(),
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w900,
                          color: Color(0xFF1B4D3E),
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        product.priceString,
                        style: const TextStyle(
                          fontSize: 28,
                          fontWeight: FontWeight.w900,
                          color: Color(0xFFF9A03F),
                        ),
                      ),
                      const SizedBox(height: 2),
                      const Text(
                        'pagamento único • vitalício',
                        style: TextStyle(fontSize: 12, color: Colors.black45),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF9A03F),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: _isPurchasing
                      ? const SizedBox(
                          width: 20, height: 20,
                          child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                        )
                      : const Text(
                          'COMPRAR',
                          style: TextStyle(color: Colors.white, fontWeight: FontWeight.w900),
                        ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
