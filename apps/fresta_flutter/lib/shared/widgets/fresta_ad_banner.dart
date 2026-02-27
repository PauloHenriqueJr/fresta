import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

/// Banner shown on free calendars to promote Fresta Plus.
/// Positioned in header/footer of calendar views.
class FrestaAdBanner extends StatelessWidget {
  const FrestaAdBanner({
    super.key,
    this.position = FrestaAdPosition.footer,
    this.onUpgrade,
  });

  final FrestaAdPosition position;
  final VoidCallback? onUpgrade;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      margin: EdgeInsets.only(
        top: position == FrestaAdPosition.footer ? 16 : 0,
        bottom: position == FrestaAdPosition.header ? 16 : 0,
        left: 16,
        right: 16,
      ),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: isDark
              ? [const Color(0xFF1B3A2F), const Color(0xFF1F4A3D)]
              : [const Color(0xFFECF5EF), const Color(0xFFD8EDE0)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isDark
              ? const Color(0xFF2D7A5F).withValues(alpha: 0.3)
              : const Color(0xFF2D7A5F).withValues(alpha: 0.15),
        ),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: const Color(0xFF2D7A5F).withValues(alpha: isDark ? 0.3 : 0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: const Text('🎁', style: TextStyle(fontSize: 20)),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'Feito com ❤️ no Fresta',
                  style: TextStyle(
                    fontWeight: FontWeight.w800,
                    fontSize: 13,
                    color: isDark ? Colors.white : const Color(0xFF1B4D3E),
                    letterSpacing: -0.3,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  'Remova anúncios com o Fresta Plus',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w500,
                    color: isDark
                        ? Colors.white.withValues(alpha: 0.6)
                        : const Color(0xFF5A7470),
                  ),
                ),
              ],
            ),
          ),
          if (onUpgrade != null)
            GestureDetector(
              onTap: onUpgrade,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: const Color(0xFF2D7A5F),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Text(
                  'Plus',
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w800,
                    fontSize: 12,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}

/// A minimal watermark variant for the bottom of shared calendar views.
class FrestaWatermark extends StatelessWidget {
  const FrestaWatermark({super.key});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 24),
      child: Center(
        child: GestureDetector(
          onTap: () => launchUrl(Uri.parse('https://fresta.storyspark.com.br')),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: isDark
                  ? Colors.white.withValues(alpha: 0.05)
                  : Colors.black.withValues(alpha: 0.04),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text('🎁', style: TextStyle(fontSize: 14)),
                const SizedBox(width: 6),
                Text(
                  'fresta.storyspark.com.br',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: isDark
                        ? Colors.white.withValues(alpha: 0.4)
                        : Colors.black.withValues(alpha: 0.35),
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

enum FrestaAdPosition { header, footer }
