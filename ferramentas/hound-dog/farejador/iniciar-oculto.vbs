' Liga o Farejador sem abrir janela (usado pelo atalho de inicialização do Windows).
' Os registros ficam em ferramentas\hound-dog\farejador\logs\.
Set sh = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
pasta = fso.GetParentFolderName(fso.GetParentFolderName(WScript.ScriptFullName))
sh.CurrentDirectory = pasta
sh.Run "node ""farejador\index.mjs""", 0, False
