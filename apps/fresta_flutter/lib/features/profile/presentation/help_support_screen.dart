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
    
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9F5),
      appBar: AppBar(
        backgroundColor: const Color(0xFFF8F9F5),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(LucideIcons.chevronLeft, color: Color(0xFF1B4D3E)),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: Text(
          'Ajuda e Suporte',
          style: theme.textTheme.titleLarge?.copyWith(
            color: const Color(0xFF1B4D3E),
            fontWeight: FontWeight.w800,
            letterSpacing: -0.5,
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
              gradient: const LinearGradient(
                colors: [Color(0xFF1B4D3E), Color(0xFF2D7A5F)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(28),
            ),
            child: Column(
              children: [
                const Icon(LucideIcons.messageCircleHeart, color: Colors.white, size: 48),
                const SizedBox(height: 16),
                const Text(
                  'Como podemos ajudar?',
                  style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.w800),
                ),
                const SizedBox(height: 8),
                Text(
                  'Nossa equipe está pronta para tirar suas dúvidas e ouvir sugestões.',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Colors.white.withValues(alpha: 0.8), fontSize: 14),
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),
          _buildSupportItem(
            icon: LucideIcons.mail,
            title: 'Enviar e-mail',
            subtitle: 'suporte@fresta.app',
            onTap: () => _launchUrl('mailto:suporte@fresta.app'),
          ),
          const SizedBox(height: 16),
          _buildSupportItem(
            icon: LucideIcons.externalLink,
            title: 'Central de Ajuda',
            subtitle: 'Tutoriais e perguntas frequentes',
            onTap: () => _launchUrl('https://fresta.storyspark.com.br/#/ajuda'),
          ),
          const SizedBox(height: 16),
          _buildSupportItem(
            icon: LucideIcons.fileText,
            title: 'Termos de Uso',
            subtitle: 'Regras e diretrizes da plataforma',
            onTap: () => _launchUrl('https://fresta.storyspark.com.br/#/termos'),
          ),
          const SizedBox(height: 16),
          _buildSupportItem(
            icon: LucideIcons.shieldCheck,
            title: 'Privacidade',
            subtitle: 'Como cuidamos dos seus dados',
            onTap: () => _launchUrl('https://fresta.storyspark.com.br/#/privacidade'),
          ),
          const SizedBox(height: 48),
          const Center(
            child: Text(
              'Feito com ❤️ pela equipe StorySpark',
              style: TextStyle(color: Color(0xFF9CA3AF), fontSize: 13, fontWeight: FontWeight.w600),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSupportItem({
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: const [
          BoxShadow(color: Color(0x06000000), blurRadius: 16, offset: Offset(0, 4)),
        ],
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
        leading: Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            color: const Color(0xFFF3F4F6),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(icon, color: const Color(0xFF1B4D3E), size: 20),
        ),
        title: Text(
          title,
          style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 16, color: Color(0xFF1B4D3E)),
        ),
        subtitle: Text(
          subtitle,
          style: const TextStyle(fontSize: 13, color: Color(0xFF5A7470)),
        ),
        trailing: const Icon(LucideIcons.chevronRight, color: Color(0xFFD1D5DB), size: 20),
        onTap: onTap,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      ),
    );
  }
}
