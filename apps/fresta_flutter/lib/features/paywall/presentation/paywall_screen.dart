import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:purchases_flutter/purchases_flutter.dart';

import '../application/purchases_service.dart';
import '../../../app/theme/theme_manager.dart';

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
    
    // Check if somehow already has entitlement
    final hasPremium = await purchases.checkPremiumEntitlement();
    if (hasPremium && mounted) {
      context.go('/creator/calendars/${widget.calendarId}');
      return;
    }

    final offerings = await purchases.getOfferings();
    if (mounted) {
      setState(() {
        _offerings = offerings;
        _isLoading = false;
      });
    }
  }

  Future<void> _makePurchase(Package package) async {
    setState(() => _isPurchasing = true);
    
    final success = await ref.read(purchasesServiceProvider).purchasePackage(package);
    
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

  Future<void> _restorePurchases() async {
    setState(() {
      _isPurchasing = true;
      _error = null;
    });
    
    final success = await ref.read(purchasesServiceProvider).restorePurchases();
    
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
            if (packages.isEmpty)
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: const Color(0xFFFFF3CD),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFFFFECCC)),
                ),
                child: const Text(
                  'Nenhum plano configurado para compra no momento. Se você está em ambiente de teste local, não conectou as chaves RevenueCat ainda.',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Color(0xFF856404)),
                ),
              )
            else
              ...packages.map((pkg) => _buildPackageCard(pkg)),
              
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
}
