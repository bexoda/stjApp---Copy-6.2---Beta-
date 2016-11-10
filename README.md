Modifications made to 
C:\Sites\stjApp - Copy 6.2 - Beta\platforms\android\CordovaLib\src\org\apache\cordova\engine\SystemWebView.java
to enable the app view links in a system browser

modifcations

public SystemWebView(Context context) {
        this(context, null);
     this.addJavascriptInterface(new JSExec(this.getContext()),"JSEx");
    }

and called by this method
class JSExec{
    Context c;
    public JSExec(Context c){this.c=c;}

    @android.webkit.JavascriptInterface
    public void openWeb(String url){
      c.startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url)));
    }
  }