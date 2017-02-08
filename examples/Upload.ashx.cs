using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;

namespace EasyUpload
{
    /// <summary>
    /// Summary description for Upload
    /// </summary>
    public class Upload : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            FileUpload(context);
        }

        public void FileUpload(HttpContext context)
        {
            ModelMessage message = new ModelMessage();

            string fileName = string.Empty;
            string fillFullName = string.Empty;

            try
            {
                #region get data

                var start = int.Parse(context.Request.Form["start"]);
                var end = int.Parse(context.Request.Form["end"]);
                var total = int.Parse(context.Request.Form["total"]);
                var name = context.Request.Form["name"];
                var fileNameFromend = context.Request.Form["filename"];

                #endregion

                #region file save

                var files = context.Request.Files;
                if (files.Count > 0)
                {
                    var file = files[0];
                    var fileInfo = new FileInfo(name);
                    if (start <= 0)
                    {
                        var extension = fileInfo.Extension;

                        #region file check

                        //type check
                        if (extension.ToLower() == ".exe")
                        {
                            throw new Exception("can not upload executable files.");
                        }

                        #endregion

                        fileName = GenerateFileName() + extension;
                    }
                    else
                    {
                        fileName = name;
                    }
                    message.obj = new { name = fileName, start = end };
                    
                    // folder
                    var folder = AppDomain.CurrentDomain.BaseDirectory + DateTime.Now.ToString("yyyyMMdd");
                    if (!Directory.Exists(folder))
                    {
                        Directory.CreateDirectory(folder);
                    }

                    fillFullName = folder + Path.DirectorySeparatorChar + fileName;

                    using (FileStream fs = new FileStream(fillFullName, FileMode.Append, FileAccess.Write))
                    {
                        var length = end - start;
                        byte[] buffer = new byte[length];
                        file.InputStream.Read(buffer, 0, length);

                        fs.Write(buffer, 0, length);
                    }

                    message.flag = true;
                }
                else
                {
                    throw new Exception("there is no file.");
                }

                #endregion
            }
            catch (Exception ex)
            {
                message.flag = false;
                message.msg = ex.Message;

                if (File.Exists(fillFullName))
                {
                    File.Delete(fillFullName);
                }
            }

            JavaScriptSerializer serializer = new JavaScriptSerializer();
            string contentSerialize = serializer.Serialize(message);

            context.Response.ContentType = "application/json";
            context.Response.Charset = "utf-8";
            context.Response.Write(contentSerialize);
            context.Response.End();
        }

        public void MultifileUpload(HttpContext context)
        {

        }

        #region auxiliary

        public string GenerateFileName()
        {
            return DateTime.Now.ToString("yyyyMMddHHmmssfff") + "_" + RandomByLength(4);
        }

        public string RandomByLength(int length)
        {
            string text = string.Empty;

            Random rd = new Random();
            for (int i = 0; i < length; i++)
            {
                text += rd.Next(0, 9);
                System.Threading.Thread.Sleep(10);
            }

            return text;
        }

        #endregion

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }

    public class ModelMessage
    {
        public object obj = null;
        public string msg = string.Empty;
        public bool flag = false;
    }
}