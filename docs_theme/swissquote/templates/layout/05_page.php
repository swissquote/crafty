<?php $this->layout('theme::layout/00_layout') ?>
<div class="Columns content">
    <aside class="Columns__left Collapsible">
        <?php $this->insert('theme::partials/navbar_content', ['params' => $params]); ?>
        <input class="Collapsible__trigger" id="ac-toc" name="accordion-toc" title="Toggle Menu" type="checkbox">
        <label class="Collapsible__label" for="ac-toc">Toggle Menu</label>

        <div class="Collapsible__content">
            <!-- Navigation -->
            <?php
            $rendertree = $tree;
            $path = '';
            if ($page['language'] !== '') {
                $rendertree = $tree[$page['language']];
                $path = $page['language'];
            }
            echo $this->get_navigation($rendertree, $path, isset($params['request']) ? $params['request'] : '', $base_page, $params['mode']);
            ?>


            <div class="Links">
                <?php if (!empty($params['html']['links'])) { ?>
                    <hr class=Separator />
                    <ul class=Nav>
                    <?php foreach ($params['html']['links'] as $name => $url) { ?>
                        <li class=Nav__item>
                        <a href="<?= $url ?>" target="_blank"><?= $name ?></a>
                        </li>   
                    <?php } ?>
                    </ul>
                <?php } ?>

                <?php if (!empty($params['html']['twitter'])) { ?>
                    <hr class=Separator />
                    <div class="Twitter">
                        <?php foreach ($params['html']['twitter'] as $handle) { ?>
                            <iframe allowtransparency="true" frameborder="0" scrolling="no" style="width:162px; height:20px;" src="https://platform.twitter.com/widgets/follow_button.html?screen_name=<?= $handle; ?>&amp;show_count=false"></iframe>
                            <br />
                            <br />
                        <?php } ?>
                    </div>
                <?php } ?>
            </div>
            <hr class=Separator />
            <div class=Copyright>
                © 2017 Swissquote Bank SA. Powered by Daux.io.
            </div>
        </div>
    </aside>
    <div class="Columns__right <?= $params['html']['float'] ? 'Columns__right--float' : 'Columns__right--full'; ?>">
        <div class="Columns__right__content">
            <div class="doc_content">
                <?= $this->section('content'); ?>
            </div>
        </div>
    </div>
</div>