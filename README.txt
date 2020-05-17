LATEST UPDATE: 
- USER SIGNUP 
- https://academind.com/learn/node-js/building-a-restful-api-with/adding-user-signup/

Note:
Connecting to mongodb atlas requires a json file with the mondodb password:
file stucture:
{
  "env": {
    "MONGO_ATLAS_PW": "password here"
  }
}

What is thsi REST API about?

4 API URLS:
1)env.../products
    Type: GET,POST
    Notes: POST takes in json body
            - Also allows files specifically images (png and jpg) difined at line 14 onwards
            - multer allws us to define requirements for the file upload e.g. it is uploading to 'uploads/' *if we do '/uploads/' it throws an err cause its absolute path and not relative
            - select statement allows us to define what keys get passed into the .then functions
            - .exec() *returns a promise so we can do a .then() and catch 

2) env.../products/:productId
    Type: DELETE,GET,PATCH

3)env.../orders
    Type: GET,POST
    Notes: - The Product at line 5 gives access to the productModel which is all the products. It gives access to the product in mongoAtlas

4) env.../orders/:orderId
    Type:GET,DELETE

The POST methods follow a schema defined in the OrderModel and ProductModel which is defined by mongoose.


Sample Request:
PRODUCTS API --- >>>>>> env .../products <<<<<<
1) GET
    - no body needed 
    - will return all the products available 

2) POST 
    - req Body (JSON) POST PRODUCT
     {
	    "name":"product-name",
	    "price":"12.99"
    }

    - POST PRODUCT AND IMAGE (req body (form-data))
    Key:
    name , price, productImage
    Value:
    'ProdName', 'Price', 'file'


SINGLE PRODUCT API --- >>>>>> env.../products/:productId
1) DELETE & GET
    - No Body
    - env.../products/:productId
>>>>>>>>>>>>>>NOTE: Response DELETE needs to be beautified
2) PATCH 
    - Sample body request - needs to be in an array so that it is iterable 
    [
	    {"
            propName":"name",
	        "value":"Patched Object"
	    }
	] 