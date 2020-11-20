import os
import ast, astunparse
import re 
from visitors import ClassVisitor, FuncVisitor
from check_for_deprecation import check_for_deprecation_in_function, check_for_deprecation_in_class
import json

def automatic_api_deprecation_detection(file1, file2, package, path1):

    deprecate_map = {}

    def generate_ast_tree(path):
        code_text = open(path,encoding='utf-8').read()
        tree = ast.parse(code_text, type_comments = True)
        return tree

    def print_py_files(path,files_list):
        for file in os.listdir(path):
            if file == "tests":
                continue
            if(files_list == [] and file=="__init__"):
                continue
            if(os.path.isfile(path+str(file)) and re.search(".*\.py$",file)):
                files_list.append(path+str(file))
            elif(os.path.isdir(path+str(file))):
                print_py_files(path+str(file)+"/",files_list)
        return files_list
    py_files = print_py_files(path1,[])
    for file in py_files:
        l1 = file.split('/')
        API_string = package
        for i in range(3,len(l1)-1):
            API_string+="."+l1[i]   
        # print(l1,API_string)
        tree = generate_ast_tree(file)
        cv = ClassVisitor(API_string)
        cv.visit(tree)
        class_map = cv.class_map
        # print(class_map)
        func_map = cv.func_map
        func_names = cv.func_names
        deprecate_map = check_for_deprecation_in_class(cv.class_map,{})
        fv = FuncVisitor(API_string)
        fv.visit(tree)
        func_names_1 = fv._func_names
        func_map_1 = fv.func_map
        # print(func_names_1)
        functions_list = [f for f in func_names_1 if f not in func_names]
        f_map = {}
        # print(func_map)
        for f in functions_list:
            api_name = fv._name_api_map[f]
            # print(f,api_name)
            f_map[api_name] = func_map_1[api_name]
        if len(f_map)>0:
            deprecate_map = check_for_deprecation_in_function(f_map,deprecate_map,1)
        # print(f_map)
        deprecate_map = check_for_deprecation_in_function(func_map,deprecate_map,2) 

        for key, value in deprecate_map.items(): 
            str1 = key.split(".")[-1]
            file1.write('%s: %s\n' % (str1, value))
            file2.write('%s: %s, %s\n' % (key, value, file))