# from django.shortcuts import render    
# from django.http import JsonResponse    
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated,AllowAny
from django.contrib.auth.models import User
from rest_framework import status
from .models import Product,Category,Cart, CartItem ,Order, OrderItem
from .serializer import ProductSerializer, CategorySerializer,CartItemSerializer, CartSerializer,RegisterSerializer,UserSerializer
from django.shortcuts import get_object_or_404

# Create your views here.
@api_view(['GET'])
def get_products(request):
    products = Product.objects.all()
    serializer= ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_product(request, pk):
    try:
        product = Product.objects.get(id=pk)
        serializer = ProductSerializer(product, context={'request': request})
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=404)

@api_view(['GET'])
def get_categories(request):
    categories = Category.objects.all()
    serializer= CategorySerializer(categories, many=True)
    return Response(serializer.data)



# @api_view(['GET'])
# def get_cart(request):
    
#     cart, created = Cart.objects.get_or_create(user=None )
#     serializer = CartSerializer(cart)
#     return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cart(request):
    try:
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    try:
        product_id = request.data.get('product_id')
        # Ensure we get a valid integer
        try:
            quantity = int(request.data.get('quantity', 1))
        except (TypeError, ValueError):
            quantity = 1

        product = get_object_or_404(Product, id=product_id)

        # Make sure your Cart model allows user=None
        cart, _ = Cart.objects.get_or_create(user=request.user)
        
        # Get or create the item
        item, created = CartItem.objects.get_or_create(cart=cart, product=product)

        if created:
            item.quantity = quantity
        else:
            item.quantity += quantity
        
        item.save()

        # IMPORTANT: Return the same structure your 'get_cart' returns
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    except Exception as e:
        # This will print the actual error to your terminal so you can see it!
        print(f"Error in add_to_cart: {e}") 
        return Response({'error': str(e)},)
    
@api_view(['POST'])
def remove_from_cart(request):
    item_id = request.data.get('product_id')
    CartItem.objects.filter(id=item_id).delete()
    
    return Response({'message': 'Product removed from cart'})
    
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_cart_quantity(request):
    item_id = request.data.get('item_id')
    quantity = request.data.get('quantity')

    if not item_id or quantity is None:
        return Response({'error': 'item id and quantity are required'}, status=400)

    try:
        item = CartItem.objects.get(id=item_id)

        quantity = int(quantity)

        if quantity < 1:
            item.delete()
            return Response({'error': 'Quantity must be at least 1'}, status=400)

        item.quantity = quantity
        item.save()

        serializer = CartItemSerializer(item)
        return Response(serializer.data)

    except CartItem.DoesNotExist:
        return Response({'error': 'Cart item not found'}, status=404)
    
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    try:
        data = request.data
        name = data.get('name')
        address = data.get('address')
        phone = data.get('phone')
        payment_method = data.get('payment_method', 'COD')
        #valid phone
        if not phone or not phone.isdigit() or len(phone) < 10:
            return Response({'error': 'Invalid phone number'}, status=400)
        # get user cart 
        cart , created = Cart.objects.get_or_create(user=request.user)
        if not cart.items.exists():
            return Response({'error': 'Cart is empty'}, status=400)
        
        
        total = sum(item.product.price * item.quantity for item in cart.items.all())
        
        order = Order.objects.create(
            user=request.user, total_amount=total
        )
        for item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price
            )
            #clear cart
            cart.items.all().delete()
            return Response({'message': 'Order created successfully'}, status=201)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
            
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        user_serializer = UserSerializer(user)
        return Response({"message": "User registered successfully","user": UserSerializer(user).data}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



