import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:url_launcher/url_launcher.dart';

class HelpSupportScreen extends StatelessWidget {
  const HelpSupportScreen({super.key});

  Future<void> _launchUrl(String url) async {
    if (!await launchUrl(Uri.parse(url))) {
      throw Exception('Could not launch $url');
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    
    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        backgroundColor: theme.scaffoldBackgroundColor,
        elevation: 0,
        leading: Padding(
          padding: const EdgeInsets.only(left: 8.0),
          child: IconButton(
            onPressed: () => Navigator.of(context).pop(),
            icon: Icon(LucideIcons.chevronLeft, color: colorScheme.primary),
            style: IconButton.styleFrom(
              backgroundColor: colorScheme.surface,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
          ),
        ),
        title: Text(
          'Ajuda e Suporte',
          style: theme.textTheme.titleLarge?.copyWith(
            color: colorScheme.onSurface,
            fontWeight: FontWeight.w900,
            letterSpacing: -1.0,
          ),
        ),
        centerTitle: true,
      ),
      body: ListView(
        padding: const EdgeInsets.all(24),
        children: [
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [colorScheme.primary, colorScheme.tertiary],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(28),
              boxShadow: [
                BoxShadow(color: colorScheme.primary.withValues(alpha: 0.2), blurRadius: 20, offset: const Offset(0, 8)),
              ],
            ),
            child: Column(
              children: [
                const Icon(LucideIcons.messageCircleHeart, color: Colors.white, size: 48),
                const SizedBox(height: 16),
                const Text(
                  'Como podemos ajudar?',
                  style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.w900, letterSpacing: -0.5),
                ),
                const SizedBox(height: 8),
                Text(
                  'Nossa equipe está pronta para tirar suas dúvidas e ouvir sugestões.',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Colors.white.withValues(alpha: 0.8), fontSize: 14, fontWeight: FontWeight.w500),
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),
          _buildSupportItem(
            context,
            icon: LucideIcons.mail,
            title: 'Enviar e-mail',
            subtitle: 'suporte@fresta.app',
            onTap: () => _launchUrl('mailto:suporte@fresta.app'),
          ),
          const SizedBox(height: 16),
          _buildSupportItem(
            context,
            icon: LucideIcons.externalLink,
            title: 'Central de Ajuda',
            subtitle: 'Tutoriais e perguntas frequentes',
            onTap: () => _launchUrl('https://fresta.storyspark.com.br/#/ajuda'),
          ),
          const SizedBox(height: 16),
          _buildSupportItem(
            context,
            icon: LucideIcons.fileText,
            title: 'Termos de Uso',
            subtitle: 'Regras e diretrizes da plataforma',
            onTap: () => _launchUrl('https://fresta.storyspark.com.br/#/termos'),
          ),
          const SizedBox(height: 16),
          _buildSupportItem(
            context,
            icon: LucideIcons.shieldCheck,
            title: 'Privacidade',
            subtitle: 'Como cuidamos dos seus dados',
            onTap: () => _launchUrl('https://fresta.storyspark.com.br/#/privacidade'),
          ),
          const SizedBox(height: 48),
          Center(
            child: Text(
              'Feito com ❤️ pela equipe StorySpark',
              style: TextStyle(color: colorScheme.onSurface.withValues(alpha: 0.3), fontSize: 13, fontWeight: FontWeight.w700),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSupportItem(
    BuildContext context, {
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    final colorScheme = Theme.of(context).colorScheme;
    return Container(
      decoration: BoxDecoration(
        color: colorScheme.surface,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 16, offset: const Offset(0, 4)),
        ],
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
        leading: Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            color: colorScheme.primary.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(icon, color: colorScheme.primary, size: 20),
        ),
        title: Text(
          title,
          style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16, color: colorScheme.onSurface, letterSpacing: -0.3),
        ),
        subtitle: Text(
          subtitle,
          style: TextStyle(fontSize: 13, color: colorScheme.onSurface.withValues(alpha: 0.6), fontWeight: FontWeight.w500),
        ),
        trailing: Icon(LucideIcons.chevronRight, color: colorScheme.onSurface.withValues(alpha: 0.2), size: 20),
        onTap: onTap,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      ),
    );
  }
}
