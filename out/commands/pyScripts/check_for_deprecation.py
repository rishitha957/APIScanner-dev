from visitors import ClassVisitor, FuncVisitor, DocStringVisitor
import astunparse,ast

def check_for_hard_coded_warning(api_str,node,deprecate_map):
		
	for node1 in ast.walk(node):
		if isinstance(node1,ast.Call):
			description = " warn - "
			id1 = ""
			for n in ast.walk(node1):
				if(isinstance(n,ast.Str)):
					description += n.s 
				if(isinstance(n,ast.Constant)) and n.value and type(n.value)=="str":
					description += n.value
				if(isinstance(n,ast.Name)):
					id1 = n.id

			if id1.find("Deprecat")!=-1 or id1.find("FutureWarning")!=-1:
				# print(astunparse.dump(node1))
				if api_str not in deprecate_map:
					deprecate_map[api_str] = description+id1
				else:
					deprecate_map[api_str] += description+id1
	return deprecate_map

def check_for_doc_string_comments(api_str,doc_str,deprecate_map):
	if doc_str==None:
		return deprecate_map
	doc_str = doc_str.lower()
	if doc_str.find("deprecat")!=-1:
		doc_str_1 = doc_str.split("\n\n")
		str1 = " ~"
		for doc in doc_str_1:
			if doc.find("deprecat")!=-1:
				str1+=doc+" "
		str1 = ' '.join(str1.split())
		if api_str not in deprecate_map:
			deprecate_map[api_str] = str1
		else:
			deprecate_map[api_str] +=str1
	return deprecate_map

def check_for_deprecation_in_function(func_map,deprecate_map,temp):
	if func_map == None:
		return deprecate_map
	for name in func_map:
		node = func_map[name]
		doc_str = ast.get_docstring(node)
		deprecate_map = check_for_doc_string_comments(name,doc_str,deprecate_map)
		deprecate_map = check_for_hard_coded_warning(name,node,deprecate_map)
		fv = FuncVisitor(name)
		fv.visit(node)
		f = fv.return_decorator_list([node])
		print(f)
		# for n in ast.walk(node):
		# 	if(isinstance(n,ast.decorator_list)):
		# 		temp = ""
		# 		id1 = ""
		# 		attr1 = ""
		# 		for n1 in ast.walk(n):
		# 			if(isinstance(n1,ast.Attribute)):
		# 				attr1 = n1.attr
		# 			if(isinstance(n1,ast.Name)):
		# 				id1 += n1.id
		# 		temp = id1+" - "+attr1
		# 		if len(temp)>0 and j.lower().find('deprecat')!=-1

		for i in range(len(f)):
			for j in f[i][1]:
				print(f[i],j)
				if len(j)>0 and j.find('deprecate')!=-1 or j.find('api')!=-1:
					if name not in deprecate_map:
						# print(temp,name,j)
						deprecate_map[name] = "@"+j
					else:
						deprecate_map[name] += ", @"+j
	return deprecate_map
def check_for_deprecation_in_class(class_map,deprecate_map):
	for name in class_map:
		doc_str = ast.get_docstring(class_map[name])
		deprecate_map =  check_for_doc_string_comments(name,doc_str,deprecate_map)
	return deprecate_map

	