import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../../../../app/theme/calendar_theme_config.dart';

class PremiumThemeChoiceModal extends StatelessWidget {
  const PremiumThemeChoiceModal({
    super.key,
    required this.themeId,
    required this.themeName,
    required this.themeConfig,
    this.isPlus = false,
  });

  final String themeId;
  final String themeName;
  final CalendarThemeConfig themeConfig;
  final bool isPlus;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final isDark = theme.brightness == Brightness.dark;

    return Container(
      padding: const EdgeInsets.only(top: 32, left: 24, right: 24, bottom: 40),
      decoration: BoxDecoration(
        color: theme.scaffoldBackgroundColor,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(32)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Crown Icon
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFFFFF7ED), // Light orange background matching web
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.workspace_premium_rounded, // Similar to crown icon
              color: Color(0xFFF97316), // Orange-500
              size: 32,
            ),
          ),
          const SizedBox(height: 24),

          // Title
          Text(
            isPlus ? 'Tema Plus Selecionado' : 'Tema Selecionado',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.w900,
              color: colorScheme.onSurface,
              letterSpacing: -0.5,
            ),
          ),
          const SizedBox(height: 12),

          // Subtitle
          Text.rich(
            TextSpan(
              text: 'O tema ',
              children: [
                TextSpan(
                  text: '"$themeName"',
                  style: const TextStyle(fontWeight: FontWeight.bold, fontStyle: FontStyle.italic),
                ),
                TextSpan(
                  text: isPlus 
                    ? ' é exclusivo do Plano Plus. Deseja ver um exemplo ou começar a criação agora?'
                    : ' está pronto para ser sua próxima surpresa. Deseja ver um exemplo ou começar agora?',
                ),
              ],
            ),
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 15,
              color: colorScheme.onSurface.withValues(alpha: 0.7),
              height: 1.4,
            ),
          ),
          const SizedBox(height: 32),

          // Create CTA
          FilledButton.icon(
            onPressed: () {
              Navigator.pop(context);
              // Navigate to creation passing themeId
              final premiumParam = isPlus ? '&premium=true' : '';
              context.push('/creator/calendars/new?theme=$themeId$premiumParam');
            },
            icon: const Icon(LucideIcons.layoutTemplate, size: 20),
            label: const Text('CRIAR COM ESTE TEMA', style: TextStyle(fontWeight: FontWeight.w800, letterSpacing: 0.5)),
            style: FilledButton.styleFrom(
              backgroundColor: isPlus ? const Color(0xFFF9A826) : const Color(0xFF1B4D3E),
              foregroundColor: Colors.white,
              minimumSize: const Size.fromHeight(56),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              elevation: 0,
            ),
          ),
          const SizedBox(height: 12),

          // View Example CTA
          OutlinedButton.icon(
            onPressed: () {
              Navigator.pop(context);
              context.push('/explore/preview/$themeId');
            },
            icon: const Icon(LucideIcons.eye, size: 20),
            label: const Text('VER EXEMPLO GRÁTIS', style: TextStyle(fontWeight: FontWeight.w900, letterSpacing: 0.5)),
            style: OutlinedButton.styleFrom(
              foregroundColor: const Color(0xFF1B3A2F),
              side: const BorderSide(color: Color(0xFFE5E7EB), width: 1.5),
              minimumSize: const Size.fromHeight(56),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              backgroundColor: isDark ? Colors.white : Colors.transparent, // Ensures visibility in dark mode
            ),
          ),
          const SizedBox(height: 32),

          // Features List
          _FeatureRow(icon: LucideIcons.check, text: 'ATÉ 365 DIAS DE DURAÇÃO'),
          const SizedBox(height: 12),
          _FeatureRow(icon: LucideIcons.check, text: 'UPLOAD DE FOTOS E VÍDEOS'),
          const SizedBox(height: 32),

          // Back Button
          TextButton(
            onPressed: () => Navigator.pop(context),
            style: TextButton.styleFrom(
              foregroundColor: colorScheme.onSurface.withValues(alpha: 0.6),
            ),
            child: const Text('VOLTAR', style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1)),
          ),
        ],
      ),
    );
  }
}

class _FeatureRow extends StatelessWidget {
  const _FeatureRow({required this.icon, required this.text});
  final IconData icon;
  final String text;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Icon(icon, color: const Color(0xFF22C55E), size: 18), // Green-500
        const SizedBox(width: 8),
        Text(
          text,
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w800,
            color: const Color(0xFF5A7470),
            letterSpacing: 0.5,
          ),
        ),
      ],
    );
  }
}
