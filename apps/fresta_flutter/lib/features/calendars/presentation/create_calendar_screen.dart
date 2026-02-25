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
  final _titleController = TextEditingController();
  final _themeController = TextEditingController(text: 'aniversario');
  int _duration = 24;
  String _privacy = 'private';
  bool _saving = false;
  String? _error;

  @override
  void dispose() {
    _titleController.dispose();
    _themeController.dispose();
    super.dispose();
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
            themeId: _themeController.text.trim().isEmpty
                ? 'aniversario'
                : _themeController.text.trim(),
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
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9F5),
      appBar: AppBar(
        backgroundColor: const Color(0xFFF8F9F5),
        elevation: 0,
        leading: IconButton(
          onPressed: () {
            if (context.canPop()) {
              context.pop();
            } else {
              context.go('/creator/calendars');
            }
          },
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Color(0xFF1B4D3E)),
        ),
        title: const Text(
          'Novo Calendário',
          style: TextStyle(
            color: Color(0xFF1B4D3E),
            fontWeight: FontWeight.w700,
            fontSize: 18,
          ),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(24, 8, 24, 48),
          children: [
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                boxShadow: const [
                  BoxShadow(color: Color(0x06000000), blurRadius: 16, offset: Offset(0, 4)),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      color: const Color(0xFFFFF7E6),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: const Icon(Icons.edit_calendar_rounded, color: Color(0xFFF9A03F)),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Comece pelo essencial',
                    style: TextStyle(
                      fontWeight: FontWeight.w800,
                      fontSize: 20,
                      color: Color(0xFF1B4D3E),
                      letterSpacing: -0.5,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Dê um nome e escolha o estilo. Você poderá personalizar cada dia e as mensagens depois.',
                    style: TextStyle(color: Color(0xFF5A7470), height: 1.5, fontSize: 14),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                boxShadow: const [
                  BoxShadow(color: Color(0x04000000), blurRadius: 16, offset: Offset(0, 4)),
                ],
              ),
              child: Column(
                children: [
                  _StyledTextField(
                    controller: _titleController,
                    label: 'Título',
                    icon: Icons.title_rounded,
                    hint: 'Ex: Aniversário da Ana',
                  ),
                  const SizedBox(height: 20),
                  _StyledTextField(
                    controller: _themeController,
                    label: 'Tema (Visual)',
                    icon: Icons.palette_outlined,
                    hint: 'Ex: aniversario, romance',
                  ),
                  const SizedBox(height: 20),
                  DropdownButtonFormField<int>(
                    initialValue: _duration,
                    icon: const Icon(Icons.unfold_more_rounded, color: Color(0xFF9CA3AF)),
                    decoration: InputDecoration(
                      labelText: 'Duração',
                      labelStyle: const TextStyle(color: Color(0xFF5A7470), fontWeight: FontWeight.w600),
                      prefixIcon: const Icon(Icons.timelapse_rounded, color: Color(0xFF2D7A5F)),
                      filled: true,
                      fillColor: const Color(0xFFF8F9F5),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                      enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: Color(0xFFE5E7EB))),
                      focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: Color(0xFF2D7A5F), width: 2)),
                    ),
                    items: const [7, 12, 24, 30].map((d) {
                      return DropdownMenuItem(
                        value: d,
                        child: Text('$d dias', style: TextStyle(color: Color(0xFF111827), fontWeight: FontWeight.w600)),
                      );
                    }).toList(),
                    onChanged: (value) {
                      if (value != null) setState(() => _duration = value);
                    },
                  ),
                  const SizedBox(height: 20),
                  DropdownButtonFormField<String>(
                    initialValue: _privacy,
                    icon: const Icon(Icons.unfold_more_rounded, color: Color(0xFF9CA3AF)),
                    decoration: InputDecoration(
                      labelText: 'Privacidade',
                      labelStyle: const TextStyle(color: Color(0xFF5A7470), fontWeight: FontWeight.w600),
                      prefixIcon: const Icon(Icons.lock_outline_rounded, color: Color(0xFF2D7A5F)),
                      filled: true,
                      fillColor: const Color(0xFFF8F9F5),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                      enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: Color(0xFFE5E7EB))),
                      focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: Color(0xFF2D7A5F), width: 2)),
                    ),
                    items: const [
                      DropdownMenuItem(value: 'private', child: Text('Privado', style: TextStyle(color: Color(0xFF111827), fontWeight: FontWeight.w600))),
                      DropdownMenuItem(value: 'public', child: Text('Público', style: TextStyle(color: Color(0xFF111827), fontWeight: FontWeight.w600))),
                    ],
                    onChanged: (value) {
                      if (value != null) setState(() => _privacy = value);
                    },
                  ),
                ],
              ),
            ),
            if (_error != null) ...[
              const SizedBox(height: 24),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFFFEF2F2),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFFFCA5A5)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.error_outline_rounded, color: Color(0xFFDC2626)),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        _error!,
                        style: const TextStyle(color: Color(0xFF991B1B), fontWeight: FontWeight.w600, fontSize: 13),
                      ),
                    ),
                  ],
                ),
              ),
            ],
            const SizedBox(height: 32),
            FilledButton(
              onPressed: _saving ? null : _save,
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
                      child: CircularProgressIndicator(strokeWidth: 2, valueColor: AlwaysStoppedAnimation<Color>(Colors.white)),
                    )
                  : const Text('Continuar', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
            ),
          ],
        ),
      ),
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
