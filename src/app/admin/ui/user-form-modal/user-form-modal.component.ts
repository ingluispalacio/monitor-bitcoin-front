import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../core/models/user.model';
import { UserRole } from '../../../core/enums/user-role.enum';

@Component({
  selector: 'app-user-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form-modal.component.html'
})
export class UserFormModalComponent implements OnInit {
  // ✅ Usar @Input() para recibir datos del padre
  @Input() data: { user?: User } = {};
  
  // ✅ Usar @Output() para enviar eventos al padre
  @Output() closed = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<any>();

  userForm: FormGroup;
  UserRole = UserRole;
  isOpen = true;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      role: [UserRole.CLIENT, Validators.required],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    
    // Si es nuevo usuario, agregar campo password
    if (!this.data.user) {
      this.userForm.addControl('password', this.fb.control('', [Validators.required, Validators.minLength(6)]));
    }

    // Si hay datos de usuario (edición), llenar el formulario
    if (this.data.user) {
      this.userForm.patchValue({
        name: this.data.user.name,
        lastname: this.data.user.lastname,
        email: this.data.user.email,
        username: this.data.user.username,
        role: this.data.user.role,
        isActive: this.data.user.active 
      });
    }
  }

  onSubmit(): void {
    if (this.userForm.valid) {
        const  { isActive,...rest } = this.userForm.value;
      this.submitted.emit({ ...rest, active: this.userForm.value.isActive });  
      this.close();
    } else {
      this.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.close();
  }

  close(): void {
    this.isOpen = false;
    this.closed.emit();  // ✅ Emitir al padre que se cerró
  }

  private markAllAsTouched(): void {
    Object.keys(this.userForm.controls).forEach(key => {
      this.userForm.get(key)?.markAsTouched();
    });
  }

  // Getters para validaciones
  get name() { return this.userForm.get('name'); }
  get lastname() { return this.userForm.get('lastname'); }
  get email() { return this.userForm.get('email'); }
  get username() { return this.userForm.get('username'); }
  get password() { return this.userForm.get('password'); }
  get role() { return this.userForm.get('role'); }
}