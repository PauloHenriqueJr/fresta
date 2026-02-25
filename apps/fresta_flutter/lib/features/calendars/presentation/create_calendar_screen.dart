import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../data/repositories/calendars_repository.dart';
import '../../auth/application/auth_controller.dart';
import '../application/calendar_providers.dart';

class CreateCalendarScreen extends ConsumerStatefulWidget {
  const CreateCalendarScreen({super.key});

  @override
  ConsumerState<CreateCalendarScreen> createState() => _CreateCalendarScreenState();
}

class _CreateCalendarScreenState extends ConsumerState<CreateCalendarScreen> {
  final PageController _pageController = PageController();
  int _currentStep = 0;

  final _titleController = TextEditingController();
  String _selectedThemeId = 'aniversario';
  int _duration = 7; // Start with 7 (free)
  String _privacy = 'private';
  bool _saving = false;
  String? _error;

  @override
  void dispose() {
    _pageController.dispose();
    _titleController.dispose();
    super.dispose();
  }

  void _nextStep() {
    if (_currentStep < 2) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
      setState(() => _currentStep++);
    } else {
      _save();
    }
  }

  void _prevStep() {
    if (_currentStep > 0) {
      _pageController.previousPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
      setState(() => _currentStep--);
    } else {
      context.pop();
    }
  }

  Future<void> _save() async {
    final user = ref.read(authControllerProvider).user;
    if (user == null) return;

    setState(() {
      _saving = true;
      _error = null;
    });

    try {
      final id = await ref.read(calendarsRepositoryProvider).createCalendar(
            ownerId: user.id,
            title: _titleController.text.trim().isEmpty
                ? 'Meu Calendário'
                : _titleController.text.trim(),
            themeId: _selectedThemeId,
            duration: _duration,
            privacy: _privacy,
          );
      ref.invalidate(myCalendarsProvider);
      if (!mounted) return;
      context.go('/creator/calendars/$id');
    } catch (e) {
      if (!mounted) return;
      setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isPremiumRequired = _duration > 7;

    return Scaffold(
      backgroundColor: const Color(0xFFF8F9F5),
      appBar: AppBar(
        backgroundColor: const Color(0xFFF8F9F5),
        elevation: 0,
        leading: IconButton(
          onPressed: _prevStep,
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Color(0xFF1B4D3E)),
        ),
        title: Column(
          children: [
            Text(
              _currentStep == 0
                  ? 'Escolha o Tema'
                  : _currentStep == 1
                      ? 'Configurações'
                      : 'Resumo e Plano',
              style: const TextStyle(
                color: Color(0xFF1B4D3E),
                fontWeight: FontWeight.w700,
                fontSize: 18,
              ),
            ),
            const SizedBox(height: 4),
            Row(
              mainAxisSize: MainAxisSize.min,
              children: List.generate(3, (index) {
                return Container(
                  width: 24,
                  height: 4,
                  margin: const EdgeInsets.symmetric(horizontal: 2),
                  decoration: BoxDecoration(
                    color: index <= _currentStep
                        ? const Color(0xFF2D7A5F)
                        : const Color(0xFFE5E7EB),
                    borderRadius: BorderRadius.circular(2),
                  ),
                );
              }),
            ),
          ],
        ),
        centerTitle: true,
      ),
      body: PageView(
        controller: _pageController,
        physics: const NeverScrollableScrollPhysics(),
        children: [
          _ThemeSelectionStep(
            selectedId: _selectedThemeId,
            onSelected: (id) => setState(() => _selectedThemeId = id),
          ),
          _ConfigStep(
            titleController: _titleController,
            duration: _duration,
            privacy: _privacy,
            onDurationChanged: (val) => setState(() => _duration = val),
            onPrivacyChanged: (val) => setState(() => _privacy = val),
          ),
          _ReviewStep(
            themeId: _selectedThemeId,
            title: _titleController.text,
            duration: _duration,
            isPremium: isPremiumRequired,
            saving: _saving,
            error: _error,
          ),
        ],
      ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: FilledButton(
            onPressed: _saving ? null : _nextStep,
            style: FilledButton.styleFrom(
              backgroundColor: const Color(0xFF1B4D3E),
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 18),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(999)),
              elevation: 0,
            ),
            child: _saving
                ? const SizedBox(
                    width: 24,
                    height: 24,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                    ),
                  )
                : Text(
                    _currentStep < 2 ? 'Continuar' : 'Criar Calendário',
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
                  ),
          ),
        ),
      ),
    );
  }
}

class _ThemeSelectionStep extends StatelessWidget {
  const _ThemeSelectionStep({required this.selectedId, required this.onSelected});
  final String selectedId;
  final ValueChanged<String> onSelected;

  @override
  Widget build(BuildContext context) {
    // List of themes matching ThemesSelectionScreen but focused for selection
    final themes = [
      ('aniversario', 'Aniversário', 'assets/images/themes/mascot-aniversario.jpg'),
      ('namoro', 'Namoro', 'assets/images/themes/mascot-namoro.jpg'),
      ('love', 'Amor & Paixão', 'assets/images/themes/mascot-love.jpg'),
      ('viagem', 'Viagem', 'assets/images/themes/mascot-viagem.jpg'),
      ('casamento', 'Casamento', 'assets/images/themes/mascot-casamento.jpg'),
      ('natal', 'Natal', 'assets/images/themes/mascot-natal.jpg'),
    ];

    return GridView.builder(
      padding: const EdgeInsets.all(24),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
        childAspectRatio: 0.85,
      ),
      itemCount: themes.length,
      itemBuilder: (context, index) {
        final t = themes[index];
        final isSelected = selectedId == t.$1;
        return GestureDetector(
          onTap: () => onSelected(t.$1),
          child: Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: isSelected ? const Color(0xFF2D7A5F) : Colors.transparent,
                width: 2,
              ),
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
                Expanded(
                  child: ClipRRect(
                    borderRadius: const BorderRadius.vertical(top: Radius.circular(18)),
                    child: Image.asset(t.$3, fit: BoxFit.cover, width: double.infinity),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(12),
                  child: Text(
                    t.$2,
                    style: TextStyle(
                      fontWeight: FontWeight.w700,
                      color: isSelected ? const Color(0xFF2D7A5F) : const Color(0xFF1B4D3E),
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}

class _ConfigStep extends StatelessWidget {
  const _ConfigStep({
    required this.titleController,
    required this.duration,
    required this.privacy,
    required this.onDurationChanged,
    required this.onPrivacyChanged,
  });

  final TextEditingController titleController;
  final int duration;
  final String privacy;
  final ValueChanged<int> onDurationChanged;
  final ValueChanged<String> onPrivacyChanged;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(24),
      children: [
        const Text(
          'Dê um nome e defina o tempo',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w800,
            color: Color(0xFF1B4D3E),
            letterSpacing: -0.5,
          ),
        ),
        const SizedBox(height: 8),
        const Text(
          'Escolha por quanto tempo a surpresa vai durar. Lembre-se: Calendários gratuitos são limitados a 7 dias.',
          style: TextStyle(color: Color(0xFF5A7470), fontSize: 14, height: 1.5),
        ),
        const SizedBox(height: 32),
        _StyledTextField(
          controller: titleController,
          label: 'Título da Fresta',
          icon: Icons.edit_rounded,
          hint: 'Ex: 24 Dias com Você',
        ),
        const SizedBox(height: 24),
        const Text(
          'Duração do Calendário',
          style: TextStyle(fontWeight: FontWeight.w700, color: Color(0xFF1B4D3E), fontSize: 15),
        ),
        const SizedBox(height: 12),
        Row(
          children: [7, 12, 24, 30].map((d) {
            final isSelected = duration == d;
            final isPremium = d > 7;
            return Expanded(
              child: GestureDetector(
                onTap: () => onDurationChanged(d),
                child: Container(
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  decoration: BoxDecoration(
                    color: isSelected ? const Color(0xFF2D7A5F) : Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: isSelected ? const Color(0xFF2D7A5F) : const Color(0xFFE5E7EB),
                    ),
                  ),
                  child: Column(
                    children: [
                      Text(
                        '$d',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w800,
                          color: isSelected ? Colors.white : const Color(0xFF1B4D3E),
                        ),
                      ),
                      Text(
                        'dias',
                        style: TextStyle(
                          fontSize: 12,
                          color: isSelected ? Colors.white.withValues(alpha: 0.8) : const Color(0xFF5A7470),
                        ),
                      ),
                      if (isPremium)
                        Padding(
                          padding: const EdgeInsets.only(top: 4),
                          child: Icon(
                            Icons.star_rounded,
                            size: 14,
                            color: isSelected ? Colors.white : const Color(0xFFF9A03F),
                          ),
                        ),
                    ],
                  ),
                ),
              ),
            );
          }).toList(),
        ),
        const SizedBox(height: 24),
        const Text(
          'Privacidade',
          style: TextStyle(fontWeight: FontWeight.w700, color: Color(0xFF1B4D3E), fontSize: 15),
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            _PrivacyOption(
              label: 'Privado',
              icon: Icons.lock_outline_rounded,
              isSelected: privacy == 'private',
              onTap: () => onPrivacyChanged('private'),
            ),
            const SizedBox(width: 12),
            _PrivacyOption(
              label: 'Público',
              icon: Icons.public_rounded,
              isSelected: privacy == 'public',
              onTap: () => onPrivacyChanged('public'),
            ),
          ],
        ),
      ],
    );
  }
}

class _PrivacyOption extends StatelessWidget {
  const _PrivacyOption({
    required this.label,
    required this.icon,
    required this.isSelected,
    required this.onTap,
  });
  final String label;
  final IconData icon;
  final bool isSelected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: isSelected ? const Color(0xFF2D7A5F) : Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: isSelected ? const Color(0xFF2D7A5F) : const Color(0xFFE5E7EB),
            ),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: 18, color: isSelected ? Colors.white : const Color(0xFF2D7A5F)),
              const SizedBox(width: 8),
              Text(
                label,
                style: TextStyle(
                  fontWeight: FontWeight.w700,
                  color: isSelected ? Colors.white : const Color(0xFF1B4D3E),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _ReviewStep extends StatelessWidget {
  const _ReviewStep({
    required this.themeId,
    required this.title,
    required this.duration,
    required this.isPremium,
    required this.saving,
    this.error,
  });

  final String themeId;
  final String title;
  final int duration;
  final bool isPremium;
  final bool saving;
  final String? error;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(24),
      children: [
        const Text(
          'Confira os detalhes',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w800,
            color: Color(0xFF1B4D3E),
            letterSpacing: -0.5,
          ),
        ),
        const SizedBox(height: 24),
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(24),
            boxShadow: [
              BoxShadow(color: Colors.black.withValues(alpha: 0.03), blurRadius: 10, offset: const Offset(0, 4)),
            ],
          ),
          child: Column(
            children: [
              _ReviewRow(label: 'Título', value: title.isEmpty ? 'Meu Calendário' : title),
              const Divider(height: 32),
              _ReviewRow(label: 'Tema', value: themeId.toUpperCase()),
              const Divider(height: 32),
              _ReviewRow(label: 'Duração', value: '$duration dias'),
              const Divider(height: 32),
              _ReviewRow(
                label: 'Plano',
                value: isPremium ? 'Plus' : 'Gratuito',
                valueColor: isPremium ? const Color(0xFFF9A03F) : const Color(0xFF2D7A5F),
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),
        if (isPremium)
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFFFFF7E6),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFFFE0B2)),
            ),
            child: Row(
              children: [
                const Icon(Icons.stars_rounded, color: Color(0xFFF9A03F)),
                const SizedBox(width: 12),
                const Expanded(
                  child: Text(
                    'Este é um calendário Plus. Você poderá criá-lo agora e o pagamento será solicitado para ativá-lo.',
                    style: TextStyle(color: Color(0xFFB45309), fontSize: 13, fontWeight: FontWeight.w600),
                  ),
                ),
              ],
            ),
          ),
        if (error != null) ...[
          const SizedBox(height: 24),
          Text(error!, style: const TextStyle(color: Colors.red, fontWeight: FontWeight.bold)),
        ],
      ],
    );
  }
}

class _ReviewRow extends StatelessWidget {
  const _ReviewRow({required this.label, required this.value, this.valueColor});
  final String label;
  final String value;
  final Color? valueColor;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(color: Color(0xFF5A7470), fontWeight: FontWeight.w600)),
        Text(
          value,
          style: TextStyle(
            color: valueColor ?? const Color(0xFF1B4D3E),
            fontWeight: FontWeight.w800,
            fontSize: 16,
          ),
        ),
      ],
    );
  }
}

class _StyledTextField extends StatelessWidget {
  const _StyledTextField({
    required this.controller,
    required this.label,
    required this.icon,
    this.hint,
  });

  final TextEditingController controller;
  final String label;
  final IconData icon;
  final String? hint;

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: controller,
      style: const TextStyle(color: Color(0xFF111827), fontWeight: FontWeight.w600),
      decoration: InputDecoration(
        labelText: label,
        hintText: hint,
        labelStyle: const TextStyle(color: Color(0xFF5A7470), fontWeight: FontWeight.w600),
        hintStyle: const TextStyle(color: Color(0xFF9CA3AF), fontWeight: FontWeight.w500),
        prefixIcon: Icon(icon, color: const Color(0xFF2D7A5F)),
        filled: true,
        fillColor: const Color(0xFFF8F9F5),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: Color(0xFFE5E7EB)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: Color(0xFF2D7A5F), width: 2),
        ),
      ),
    );
  }
}
