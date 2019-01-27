from django.http import HttpResponse


def root(request):
	return HttpResponse("Root page")


def square(request, n):
	return HttpResponse(n * n)


def subtract(request, a, b):
	return HttpResponse(a - b)

