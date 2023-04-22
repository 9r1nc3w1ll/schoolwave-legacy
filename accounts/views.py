from django.shortcuts import render
from django.shortcuts import render, redirect
from django.contrib import messages
from .forms import RegisterForm, UserLoginForm
from django.contrib.auth import login, logout, authenticate

# Create your views here.
def register(request):
    if request.method == 'GET':
        form  = RegisterForm()
        context = {
            'form': form
            }
        return render(request, 'accounts/register.html', context)
        
    if request.method == 'POST':
        form  = RegisterForm(request.POST)
        if form.is_valid():
            form.save()
            user = form.cleaned_data.get('username')
            messages.success(request, 'Account was created for ' + user)
            return redirect('accounts:login')
        else:
            print('Form is not valid')
            messages.error(request, 'Error Processing Your Request')
            context = {
                'form': form
                }
            return render(request, 'accounts/register.html', context)

    return render(request, 'accounts/register.html')

def LoginView(request):
    if request.method == 'POST':
        form = UserLoginForm(data = request.POST)
        if form.is_valid():
            # log in the user
            user = form.get_user()
            login(request, user)
            if 'next' in request.POST:
                return redirect(request.POST.get('next'))
            else:
                return redirect('/')
    else:
        form = UserLoginForm()
    return render(request,'accounts/login.html', {'form':form})

def logout_view(request):
    if request.method == 'POST':
        logout(request)
        return redirect('/')