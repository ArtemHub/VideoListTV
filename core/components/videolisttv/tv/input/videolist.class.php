<?php
if(!class_exists('VideoListInputRender')) {
    class VideoListInputRender extends modTemplateVarInputRender {
        public function getTemplate() {
            $apikey = $this->modx->getOption('apikey');
            $this->setPlaceholder('apikey', $apikey);
            return $this->modx->getOption('core_path').'components/videolisttv/tv/input/tpl/videolist.tpl';
        }
        public function process($value,array $params = array()) {
            $assetsPath = $this->modx->getOption('assets_url',null,MODX_ASSETS_URL).'components/videolisttv/';
            $this->modx->regClientCSS($assetsPath.'css/mgr/tv/videolist.css');
            $this->modx->regClientStartupScript($assetsPath.'js/mgr/videolist.js');
            $this->modx->regClientStartupScript($assetsPath.'js/mgr/tv/tv.videolist.textfield.js');
            $this->modx->regClientStartupScript($assetsPath.'js/mgr/tv/tv.videolist.window.js');
            $this->modx->regClientStartupScript($assetsPath.'js/mgr/tv/tv.videolist.panel.js');
            $this->modx->regClientStartupScript($assetsPath.'js/mgr/tv/tv.videolist.view.js');
        }
    }
}
return 'VideoListInputRender';