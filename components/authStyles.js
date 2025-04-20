import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardAvoidingView: { flex: 1 },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 16,
  },
  icon: { marginRight: 10 },
  input: {
    flex: 1,
    height: 50,
    color: '#fff',
  },
  authButton: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  authButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6a11cb',
  },
  linkText: {
    marginTop: 20,
    color: '#fff',
  },
  link: {
    fontWeight: 'bold',
    color: '#fff',
  },
  roleButton: {
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  selectedRoleButton: {
    backgroundColor: '#fff',
  },
  roleButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  selectedRoleText: {
    color: '#6a11cb',
  },
});