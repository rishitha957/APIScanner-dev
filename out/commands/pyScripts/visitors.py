import ast, astunparse

class DocStringVisitor(ast.NodeVisitor):
    """Visits all the Constant Nodes in AST to get the doc string"""
    def __init__(self):
        self.visited = 0
        self.doc_str = ""
    def generic_visit(self,node):
        if isinstance(node, ast.Constant) and self.visited == 0:
            self.visited = 1
            self.doc_str = node.value
        ast.NodeVisitor.generic_visit(self,node)

class FuncVisitor(ast.NodeVisitor):
    """Visits all the FunctionDef Nodes in AST"""
    def __init__(self,api_str):
        super(FuncVisitor, self).__init__()
        self.api_name = api_str
        self.func_map = {}
        self._func_names = []
        self._name_api_map = {}
        self._func_nodes = []
        self.func_dec_map = []

    def flatten_attr(self,node):
        """For Nested Decorators"""
        if isinstance(node, ast.Attribute):
            return str(self.flatten_attr(node.value)) + '.' + node.attr
        elif isinstance(node, ast.Name):
            return str(node.id)
        else:
            pass

    def return_list(self):
        return self.func_dec_map

    def return_decorator_list(self, _func_nodes = None):
        if _func_nodes is None:
            _func_nodes = self._func_nodes
        for node in _func_nodes:
            found_decorators = []
            for decorator in node.decorator_list:
                if isinstance(decorator, ast.Name):
                    found_decorators.append(decorator.id)
                elif isinstance(decorator, ast.Attribute):
                    found_decorators.append(self.flatten_attr(decorator))
                elif isinstance(decorator, ast.Call):
                    comment = ""
                    id1 = ""
                    attr1 = ""
                    for val_node in ast.walk(decorator):
                        if isinstance(val_node,ast.Name):
                            id1 = val_node.id
                        if isinstance(val_node,ast.Attribute):
                            attr1 = val_node.attr
                        if isinstance(val_node,ast.Constant):
                            comment = val_node.value
                    try:
                        found_decorators.append(id1+"."+attr1+" # "+comment)
                    except:
                        pass
            self.func_dec_map.append((node.name,found_decorators))
        return self.func_dec_map

    def generic_visit(self,node):
        if isinstance(node,ast.FunctionDef):
            flag = 0
            if(node.name == "__init__" and self.api_name.find(".")!=-1):
                # print("here - ",node.name,self.api_name)
                name1 = self.api_name
            elif(node.name =="__init__"):
                # print("2 - ",self.api_name)
                flag = 1
            else:
                name1 = self.api_name+"."+node.name+"()"
            if(flag==0):
                self.func_map[name1] = node
                self._func_names.append(name1.split(".")[-1])
                self._name_api_map[name1.split(".")[-1]] = name1
                self._func_nodes.append(node)
        ast.NodeVisitor.generic_visit(self,node)

        
class ClassVisitor(ast.NodeVisitor):
    def __init__(self,api_str):
        self.api_name = api_str
        self.class_map = {}
        self.func_map = {}
        self.func_names = []
    def generic_visit(self,node):
        if isinstance(node, ast.ClassDef):
            name1 = self.api_name+"."+node.name
            self.class_map[name1] = node
            fv = FuncVisitor(name1)
            fv.visit(node)
            for f in fv.func_map:
                self.func_map[f] = fv.func_map[f]
            for f in fv._func_names:
                self.func_names.append(f)
            if(name1 == "PairGrid"):
                print(fv.func_map)
        ast.NodeVisitor.generic_visit(self,node)