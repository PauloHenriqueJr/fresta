import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

class NotificationsSettingsScreen extends StatefulWidget {
  const NotificationsSettingsScreen({super.key});

  @override
  State<NotificationsSettingsScreen> createState() => _NotificationsSettingsScreenState();
}

class _NotificationsSettingsScreenState extends State<NotificationsSettingsScreen> {
  bool _dailyReminders = true;
  bool _newSurprises = true;
  bool _marketing = false;

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
          'Notificações',
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
          _buildToggleSection(
            title: 'Lembretes Diários',
            subtitle: 'Receba um aviso toda manhã para abrir seu calendário.',
            value: _dailyReminders,
            onChanged: (val) => setState(() => _dailyReminders = val),
            icon: LucideIcons.bellRing,
            iconColor: const Color(0xFFF9A03F),
          ),
          const SizedBox(height: 16),
          _buildToggleSection(
            title: 'Novas Surpresas',
            subtitle: 'Saiba quando um criador adicionar novo conteúdo.',
            value: _newSurprises,
            onChanged: (val) => setState(() => _newSurprises = val),
            icon: LucideIcons.sparkles,
            iconColor: const Color(0xFF2D7A5F),
          ),
          const SizedBox(height: 16),
          _buildToggleSection(
            title: 'Novidades e Dicas',
            subtitle: 'Dicas de presentes e atualizações do Fresta.',
            value: _marketing,
            onChanged: (val) => setState(() => _marketing = val),
            icon: LucideIcons.megaphone,
            iconColor: const Color(0xFF1B4D3E),
          ),
          const SizedBox(height: 40),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Text(
              'As notificações ajudam você a não perder nenhum dia de surpresa. Você pode alterar essas configurações a qualquer momento.',
              textAlign: TextAlign.center,
              style: TextStyle(
                color: const Color(0xFF5A7470).withValues(alpha: 0.7),
                fontSize: 13,
                height: 1.5,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildToggleSection({
    required String title,
    required String subtitle,
    required bool value,
    required ValueChanged<bool> onChanged,
    required IconData icon,
    required Color iconColor,
  }) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: const [
          BoxShadow(color: Color(0x06000000), blurRadius: 16, offset: Offset(0, 4)),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: iconColor.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Icon(icon, color: iconColor, size: 22),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontWeight: FontWeight.w700,
                    fontSize: 16,
                    color: Color(0xFF1B4D3E),
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  style: const TextStyle(
                    fontSize: 12,
                    color: Color(0xFF5A7470),
                  ),
                ),
              ],
            ),
          ),
          Switch.adaptive(
            value: value,
            onChanged: onChanged,
            activeTrackColor: const Color(0xFF2D7A5F).withValues(alpha: 0.5),
            activeThumbColor: const Color(0xFF2D7A5F),
          ),
        ],
      ),
    );
  }
}
