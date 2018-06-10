(TeX-add-style-hook
 "proyecto"
 (lambda ()
   (TeX-add-to-alist 'LaTeX-provided-package-options
                     '(("inputenc" "utf8") ("babel" "spanish")))
   (TeX-run-style-hooks
    "latex2e"
    "report"
    "rep10"
    "graphicx"
    "inputenc"
    "babel"))
 :latex)

