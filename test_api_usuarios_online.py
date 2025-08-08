#!/usr/bin/env python
"""
Script completo para probar todos los endpoints de la API de usuarios
"""
import requests
import json
import sys

# Configuración base
BASE_URL = "https://Emno.pythonanywhere.com/api/usuarios"
HEADERS = {"Content-Type": "application/json"}

class APITester:
    def __init__(self):
        self.admin_token = None
        self.user_token = None
        self.registered_user_id = None
        self.created_user_id = None
        
    def print_separator(self, title):
        """Imprime un separador visual"""
        print("\n" + "="*60)
        print(f" {title}")
        print("="*60)
    
    def make_request(self, method, endpoint, data=None, token=None, expected_status=None):
        """Realiza una petición HTTP y maneja errores"""
        url = f"{BASE_URL}{endpoint}"
        print(url)
        headers = HEADERS.copy()
        
        if token:
            headers["Authorization"] = f"Bearer {token}"
        
        try:
            if method.upper() == 'GET':
                response = requests.get(url, headers=headers)
            elif method.upper() == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method.upper() == 'PUT':
                response = requests.put(url, json=data, headers=headers)
            elif method.upper() == 'PATCH':
                response = requests.patch(url, json=data, headers=headers)
            elif method.upper() == 'DELETE':
                response = requests.delete(url, json=data, headers=headers)
            
            print(f"{method.upper()} {endpoint}")
            print(f"Status: {response.status_code}")
            
            if response.status_code != 404:
                try:
                    result = response.json()
                    print(f"Response: {json.dumps(result, indent=2, ensure_ascii=False)}")
                    
                    if expected_status and response.status_code == expected_status:
                        print("✅ Test pasó")
                    elif not expected_status and 200 <= response.status_code < 300:
                        print("✅ Test pasó")
                    else:
                        print("❌ Test falló")
                    
                    return response.status_code, result
                except json.JSONDecodeError:
                    print(f"Response (text): {response.text}")
                    return response.status_code, response.text
            else:
                print("❌ Endpoint no encontrado")
                return response.status_code, None
                
        except requests.exceptions.ConnectionError:
            print("❌ Error: Servidor no disponible. Ejecuta 'python manage.py runserver'")
            return None, None
        except Exception as e:
            print(f"❌ Error: {e}")
            return None, None
    
    def test_public_register(self):
        """Prueba el registro público"""
        self.print_separator("PRUEBA: Registro Público")
        
        data = {
            "username": "testuser123",
            "email": "testuser123@ejemplo.com",
            "password": "testpass123",
            "password_confirm": "testpass123",
            "first_name": "Usuario",
            "last_name": "Prueba",
            "phone": "+1234567890",
            "address": "Calle Ejemplo 123"
        }
        
        status, result = self.make_request('POST', '/register/', data, expected_status=201)
        
        if result and 'user' in result:
            self.registered_user_id = result['user']['id']
            print(f"📝 Usuario registrado con ID: {self.registered_user_id}")
    
    def test_login_admin(self):
        """Prueba login de administrador"""
        self.print_separator("PRUEBA: Login Administrador")
        
        data = {
            "username": "admin",
            "password": "admin123"
        }
        
        status, result = self.make_request('POST', '/token/', data, expected_status=200)
        
        if result and 'access' in result:
            self.admin_token = result['access']
            print(f"🔑 Token admin obtenido: {self.admin_token[:50]}...")
    
    def test_login_user(self):
        """Prueba login de usuario regular"""
        self.print_separator("PRUEBA: Login Usuario Regular")
        
        data = {
            "username": "testuser123",
            "password": "testpass123"
        }
        
        status, result = self.make_request('POST', '/token/', data, expected_status=200)
        
        if result and 'access' in result:
            self.user_token = result['access']
            print(f"🔑 Token usuario obtenido: {self.user_token[:50]}...")
    
    def test_protected_endpoints(self):
        """Prueba endpoints protegidos básicos"""
        self.print_separator("PRUEBA: Endpoints Protegidos Básicos")
        
        # Endpoint protegido con token de admin
        print("\n--- Con token de admin ---")
        self.make_request('GET', '/protegida/', token=self.admin_token)
        
        # Endpoint protegido con token de usuario
        print("\n--- Con token de usuario ---")
        self.make_request('GET', '/protegida/', token=self.user_token)
        
        # Endpoint sin token (debe fallar)
        print("\n--- Sin token (debe fallar) ---")
        self.make_request('GET', '/protegida/', expected_status=401)
    
    def test_admin_endpoints(self):
        """Prueba endpoints exclusivos de admin"""
        self.print_separator("PRUEBA: Endpoints Solo Admin")
        
        # Admin endpoint con token de admin
        print("\n--- Admin endpoint con token de admin ---")
        self.make_request('GET', '/admin/', token=self.admin_token)
        
        # Admin endpoint con token de usuario (debe fallar)
        print("\n--- Admin endpoint con token de usuario (debe fallar) ---")
        self.make_request('GET', '/admin/', token=self.user_token, expected_status=403)
        
        # Estadísticas con token de admin
        print("\n--- Estadísticas con token de admin ---")
        self.make_request('GET', '/stats/', token=self.admin_token)
        
        # Estadísticas con token de usuario (debe fallar)
        print("\n--- Estadísticas con token de usuario (debe fallar) ---")
        self.make_request('GET', '/stats/', token=self.user_token, expected_status=403)
    
    def test_user_list_crud(self):
        """Prueba CRUD de lista de usuarios"""
        self.print_separator("PRUEBA: Lista de Usuarios CRUD")
        
        # Listar usuarios como admin
        print("\n--- Listar usuarios como admin ---")
        self.make_request('GET', '/users/', token=self.admin_token)
        
        # Listar usuarios como usuario regular (debe fallar)
        print("\n--- Listar usuarios como usuario regular (debe fallar) ---")
        self.make_request('GET', '/users/', token=self.user_token, expected_status=403)
        
        # Crear usuario como admin
        print("\n--- Crear usuario como admin ---")
        data = {
            "username": "admincreated",
            "email": "admincreated@ejemplo.com",
            "password": "adminpass123",
            "password_confirm": "adminpass123",
            "first_name": "Usuario",
            "last_name": "Creado",
            "rol": "moderator"
        }
        
        status, result = self.make_request('POST', '/users/', data, token=self.admin_token, expected_status=201)
        
        if result and 'id' in result:
            self.created_user_id = result['id']
            print(f"📝 Usuario creado por admin con ID: {self.created_user_id}")
        
        # Crear usuario como usuario regular (debe fallar)
        print("\n--- Crear usuario como usuario regular (debe fallar) ---")
        self.make_request('POST', '/users/', data, token=self.user_token, expected_status=403)
    
    def test_user_detail_crud(self):
        """Prueba CRUD de usuario específico"""
        self.print_separator("PRUEBA: Usuario Específico CRUD")
        
        if not self.registered_user_id:
            print("⚠️ No hay ID de usuario registrado para probar")
            return
        
        # Ver propio perfil como usuario
        print(f"\n--- Ver propio perfil (ID: {self.registered_user_id}) ---")
        self.make_request('GET', f'/users/{self.registered_user_id}/', token=self.user_token)
        
        # Ver perfil de otro usuario como usuario regular (debe fallar)
        if self.created_user_id:
            print(f"\n--- Ver perfil de otro usuario (ID: {self.created_user_id}) como usuario regular (debe fallar) ---")
            self.make_request('GET', f'/users/{self.created_user_id}/', token=self.user_token, expected_status=403)
        
        # Ver cualquier perfil como admin
        print(f"\n--- Ver perfil como admin ---")
        self.make_request('GET', f'/users/{self.registered_user_id}/', token=self.admin_token)
        
        # Actualizar propio perfil como usuario
        print(f"\n--- Actualizar propio perfil ---")
        data = {
            "first_name": "Usuario Actualizado",
            "phone": "+9876543210"
        }
        self.make_request('PATCH', f'/users/{self.registered_user_id}/', data, token=self.user_token)
    
    def test_profile_endpoint(self):
        """Prueba endpoint de perfil propio"""
        self.print_separator("PRUEBA: Endpoint de Perfil Propio")
        
        # Ver perfil propio
        print("\n--- Ver perfil propio ---")
        self.make_request('GET', '/profile/', token=self.user_token)
        
        # Actualizar perfil propio
        print("\n--- Actualizar perfil propio ---")
        data = {
            "last_name": "Apellido Actualizado",
            "address": "Nueva Dirección 456"
        }
        self.make_request('PUT', '/profile/', data, token=self.user_token)
        
        # Ver perfil actualizado
        print("\n--- Ver perfil actualizado ---")
        self.make_request('GET', '/profile/', token=self.user_token)
    
    def test_change_password(self):
        """Prueba cambio de contraseña"""
        self.print_separator("PRUEBA: Cambio de Contraseña")
        
        # Cambiar contraseña con datos incorrectos (debe fallar)
        print("\n--- Cambiar contraseña con contraseña actual incorrecta (debe fallar) ---")
        data = {
            "old_password": "wrongpassword",
            "new_password": "newpass123",
            "new_password_confirm": "newpass123"
        }
        self.make_request('POST', '/change-password/', data, token=self.user_token, expected_status=400)
        
        # Cambiar contraseña correctamente
        print("\n--- Cambiar contraseña correctamente ---")
        data = {
            "old_password": "testpass123",
            "new_password": "newpass123",
            "new_password_confirm": "newpass123"
        }
        self.make_request('POST', '/change-password/', data, token=self.user_token)
    
    def test_admin_functions(self):
        """Prueba funciones administrativas"""
        self.print_separator("PRUEBA: Funciones Administrativas")
        
        if not self.created_user_id:
            print("⚠️ No hay usuario creado para probar funciones administrativas")
            return
        
        # Toggle status de usuario
        print(f"\n--- Toggle status del usuario ID: {self.created_user_id} ---")
        self.make_request('POST', f'/users/{self.created_user_id}/toggle-status/', token=self.admin_token)
        
        # Toggle status como usuario regular (debe fallar)
        print(f"\n--- Toggle status como usuario regular (debe fallar) ---")
        self.make_request('POST', f'/users/{self.created_user_id}/toggle-status/', token=self.user_token, expected_status=403)
    
    def test_delete_account(self):
        """Prueba eliminación de cuenta"""
        self.print_separator("PRUEBA: Eliminación de Cuenta")
        
        # Intentar eliminar cuenta de otro usuario como usuario regular (debe fallar)
        if self.created_user_id:
            print(f"\n--- Intentar eliminar cuenta de otro usuario (debe fallar) ---")
            self.make_request('DELETE', f'/users/{self.created_user_id}/', token=self.user_token, expected_status=403)
        
        # Eliminar cuenta propia desde /profile/
        print(f"\n--- Eliminar cuenta propia desde /profile/ ---")
        print("⚠️ ADVERTENCIA: Esto eliminará la cuenta de prueba")
        response = input("¿Deseas continuar con la eliminación? (y/N): ")
        
        if response.lower() == 'y':
            self.make_request('DELETE', '/profile/', token=self.user_token)
            print("✅ Cuenta eliminada - el token ya no será válido")
        else:
            print("🚫 Eliminación de cuenta omitida")
    
    def run_all_tests(self):
        """Ejecuta todas las pruebas"""
        print("🧪 INICIANDO PRUEBAS DE API COMPLETAS")
        print("Asegúrate de que el servidor esté ejecutándose en http://127.0.0.1:8000")
        print("También asegúrate de tener un usuario admin con credenciales: admin/admin123")
        
        input("\nPresiona Enter para continuar...")
        
        # Ejecutar pruebas en orden
        self.test_public_register()
        self.test_login_admin()
        self.test_login_user()
        self.test_protected_endpoints()
        self.test_admin_endpoints()
        self.test_user_list_crud()
        self.test_user_detail_crud()
        self.test_profile_endpoint()
        self.test_change_password()
        self.test_admin_functions()
        
        # Prueba de eliminación al final
        self.test_delete_account()
        
        self.print_separator("PRUEBAS COMPLETADAS")
        print("✅ Todas las pruebas han sido ejecutadas")
        print("📊 Revisa los resultados arriba para ver qué funcionó y qué no")

if __name__ == "__main__":
    tester = APITester()
    
    if len(sys.argv) > 1:
        # Permitir ejecutar pruebas específicas
        test_name = sys.argv[1]
        if hasattr(tester, f'test_{test_name}'):
            # Ejecutar configuración básica primero
            tester.test_public_register()
            tester.test_login_admin()
            tester.test_login_user()
            # Ejecutar prueba específica
            getattr(tester, f'test_{test_name}')()
        else:
            print(f"❌ Prueba '{test_name}' no encontrada")
            print("Pruebas disponibles:")
            methods = [method for method in dir(tester) if method.startswith('test_')]
            for method in methods:
                print(f"  - {method[5:]}")  # Remover 'test_' del nombre
    else:
        # Ejecutar todas las pruebas
        tester.run_all_tests()