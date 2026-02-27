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
          'Notificações',
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
          _buildToggleSection(
            context: context,
            title: 'Lembretes Diários',
            subtitle: 'Receba um aviso toda manhã para abrir seu calendário.',
            value: _dailyReminders,
            onChanged: (val) => setState(() => _dailyReminders = val),
            icon: LucideIcons.bellRing,
            iconColor: const Color(0xFFF9A03F),
          ),
          const SizedBox(height: 16),
          _buildToggleSection(
            context: context,
            title: 'Novas Surpresas',
            subtitle: 'Saiba quando um criador adicionar novo conteúdo.',
            value: _newSurprises,
            onChanged: (val) => setState(() => _newSurprises = val),
            icon: LucideIcons.sparkles,
            iconColor: const Color(0xFF2D7A5F),
          ),
          const SizedBox(height: 16),
          _buildToggleSection(
            context: context,
            title: 'Novidades e Dicas',
            subtitle: 'Dicas de presentes e atualizações do Fresta.',
            value: _marketing,
            onChanged: (val) => setState(() => _marketing = val),
            icon: LucideIcons.megaphone,
            iconColor: colorScheme.primary,
          ),
          const SizedBox(height: 40),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Text(
              'As notificações ajudam você a não perder nenhum dia de surpresa. Você pode alterar essas configurações a qualquer momento.',
              textAlign: TextAlign.center,
              style: TextStyle(
                color: colorScheme.onSurface.withValues(alpha: 0.5),
                fontSize: 13,
                height: 1.5,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildToggleSection({
    required BuildContext context,
    required String title,
    required String subtitle,
    required bool value,
    required ValueChanged<bool> onChanged,
    required IconData icon,
    required Color iconColor,
  }) {
    final colorScheme = Theme.of(context).colorScheme;
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: colorScheme.surface,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 16, offset: const Offset(0, 4)),
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
                  style: TextStyle(
                    fontWeight: FontWeight.w800,
                    fontSize: 16,
                    color: colorScheme.onSurface,
                    letterSpacing: -0.3,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  style: TextStyle(
                    fontSize: 12,
                    color: colorScheme.onSurface.withValues(alpha: 0.6),
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
          Switch.adaptive(
            value: value,
            onChanged: onChanged,
            activeTrackColor: colorScheme.primary.withValues(alpha: 0.3),
            activeColor: colorScheme.primary,
          ),
        ],
      ),
    );
  }
}
